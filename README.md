# COH2 CHARTS, PLAYER STATS, LEADERBOARDS

![GitHub release (latest by date)](https://img.shields.io/github/v/release/cohstats/coh2stats)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m788579058-010f84f8b7e284e354b0946c?label=uptime%2030%20days)
[![DeepScan grade](https://deepscan.io/api/teams/15780/projects/20479/branches/558227/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15780&pid=19027&bid=481420)
![GitHub CodeQL Workflow Status (branch)](https://img.shields.io/github/workflow/status/cohstats/coh2stats/CodeQL/master?label=CodeQL)

### Website https://coh2stats.com/

With all the data, player cards, leaderboards, maps, stats, commanders, inte-bulletins and much more!

### Desktop App [here](packages/app/README.md)

For current match details, player information and other features.

This project is set to create new usage charts for the game COH2.
And also create web access to leaderboards, player cards and recent matches for players.
The author of the game doesn't provide any global statistics. And online leaderboards has been shutdown recently.

This project is inspired by coh2chart.com which has data
only for years 2016-2017 after which it was shut down.

## Technical description

The project is created in Google Cloud with usage of Firebase.
The main language of the project is set to be JavaScript. Which will
be used on both FE and BE.

- FE - JavaScript, React
- BE - Serverless JS
- DB - FireStore (NoSQL DB)

GCP services to be used:

- Firebase Hosting - For hosting the website
- Firebase Firestore - NoSQL Database
- Firebase Cloud functions - Is the main backend for crawling and data processing
- [GCP Pub/Sub](https://cloud.google.com/pubsub/docs/overview) - For messaging between the functions
- GCP Storage - For storing extra data

Thing to consider:

- There is a large amount of matches, we store them in the FireStore, however
  once you store the match. You don't do any changes to it, therefore it would be
  better to store them in the [BigQuery](https://cloud.google.com/bigquery/) where
  we could run our analysis more easily and it would be Faster and Cheaper.

### CI/CD

Only web package is automatically deploy. Cloud functions
need to be done manually for now.

#### Prod

Tagged versions are automatically deployed to https://coh2stats.com/

#### Dev

`master` branch is automatically deployed to https://coh2-ladders-dev.web.app/

### Development

The repository is yarn workspace. Use `yarn` to manage this.
Do `yarn install` from the project root to install dependencies.

To run beautifier and linting:
`yarn fix`

Use Node version 14.x or as described in `/packages/functions/package.json`

#### Web

- To start local web dev: `yarn web start`
- Test: `yarn web test` (located in `packages/web/src/tests`)
- Build: `yarn web build`

#### Functions

- To build the functions:
  `yarn functions build`
- To run the tests on functions:
  `yarn functions test`

### Env variables for Cloud Functions

Env variables for the functions are deployed manually - not integrated in the CI/CD.
See `config.ts`

```javascript
const config = firebaseConfig().env;
```

See https://firebase.google.com/docs/functions/config-env for more info.

### Patch update steps for text bulletin / commander data

1. Run script `bulletinsAndCommanders.py` with correct path to your COH2 folder
2. Run script `fixCommanderImages.py` to fix the generated commanderData.json file
3. Copy the generated files `*ServerData.json` into `packages/functions/src/libs/data/`
   - bulletinServerData.json
   - commanderServerData.json
4. Copy the generates files `*Data.json` into `packages/web/src/coh/data/`
   - bulletinData.json
   - commanderData.json
5. Run formatter by using commander `yarn fix`
6. Observe the changes
7. Update the `packages/web/src/config.tsx` with the right date / patch name

### Crawler process

Diagram:
https://lucid.app/documents/embeddedchart/ec7ffc19-50c4-4104-bcf9-287e2af3ac62

Crawler process is set to run every day. There is a huge amount of data
so we need to do it everyday to avoid big stress on the Relic API.

**The crawling is design in a way which should not stress the Relic API (aka
slowly).**

The crawler process should run everyday. Most likely ~5 AM UTC. As that
should be the time with least players (EU, US asleep). But we will treat
this date as a date -1 day data.  
 _Example: We crawl on 5 AM 24th, it's a data for the 23th._

##### 1. We request top 200 players from all leaderboards

This gives us 5200 positions. It's done by cloud function `getCOHLadders`.
We can request by 200 chunks from the API => 26 Relic API calls.  
This operation takes around 30 seconds.

##### 2. Filter only unique players

We extract the Steam IDs, only unique players are kept.
This gives us ~2900 players for the top 5200 positions.

##### 3. Send player ids to Pub/Sub que

We send the player Steam IDs as a messages to the que called `"download-matches"`
Each message has array of IDs. The current chunk is set to X.
~~TODO: Experiment with the best chunk size.~~ We want the chunk size
to be pretty big because we can filter the duplicates only in
one chunk. (We filter the rest when we hit the DB but we want to
avoid unnecessary writes to the DB)

##### 4. Pub/Sub que `"download-matches"` is consumed

The que is consumed by cloud functions `getPlayerMatches`.
The main benefit of the que is that any service of our application
can send a message into it. Making sure the match is saved.
~~Only 2-3 instances of the function are allowed. To slow down the processing.~~
We had to limit it to 1 function. We were getting errors "Too many requests"
from the API.

The function takes the array of the IDs and downloads the matches
of each player in sequence (again not to stress the API).

This takes around 45-85 seconds. Usually ~350-500ms per player. However
there are anomalies which can go up to 5-6 seconds per player.

This makes the amount of players API calls. (~2900)
The process takes around 25 minutes.

##### 5. Matches are filtered and modified

We filter matches only from the previous day (The API returns all player matches).
We try to filter any duplicated matches (1 match is shown that many times as it has players).
This is designed not to do extra writes to the DB with the data we already have.
This saves us DB reads and writes.

We remove any extra fields we don't care about.

##### 6. Matches are saved to the DB

All matches are saved in the FireStore under collection /matches
The ID of the document is the ID of the match which ensures nothing
can be duplicated.

##### 7. Analysis is run

We can get matches for particular day and run analysis on them.

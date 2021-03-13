# COH2 CHARTS, STATS, LEADERBOARDS

This project is set to create new usage charts for the game COH2.
The author of the game doesn't provide any global statistics.  
http://www.companyofheroes.com/leaderboards

This project is inspired by http://coh2chart.com/ which has data
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

### Development

The repository is yarn workspace. Use `yarn` to manage this.
Do `yarn install` to install dependencies.

To start local web dev:
`yarn web start`
build:
`yarn web build`

To build the functions:
`yarn functions build`

To run the tests on functions:
`yarn functions test`

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
Only 2-3 instances of the function are allowed. To slow down the processing.

The function takes the array of the IDs and downloads the matches
of each player in sequence (again not to stress the API).

This takes around 45-85 seconds. Usually ~350-500ms per player. However
there are anomalies which can go up to 5-6 seconds per player.

This makes the amount of players API calls. (~2900)
The process takes around 25 minutes.

##### 5. Matches are filtered and modified

We filter matches only for the last 25 hours.
Because the crawler runs every day we can keep only last 25 hours matches.
1 hour is extra to give us overtime while the functions are running.

This is designed not to do extra writes to the DB with the data we already have.
This saves us DB reads and writes.

We remove any extra fields we don't care about.

##### 6. Matches are saved to the DB

All matches are saved in the FireStore under collection /matches
The ID of the document is the ID of the match which ensures nothing
can be duplicated.

##### 7. Analysis is run

We can get matches for particular day and run analysis on them.

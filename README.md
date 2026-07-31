# COH2 CHARTS, PLAYER STATS, LEADERBOARDS

![GitHub release (latest by date)](https://img.shields.io/github/v/release/cohstats/coh2stats)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m788579058-010f84f8b7e284e354b0946c?label=uptime%2030%20days)
[![DeepScan grade](https://deepscan.io/api/teams/15780/projects/20479/branches/558227/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15780&pid=20479&bid=558227)
[![Discord](https://img.shields.io/discord/959118129240350740?style=flat&label=Chat%20on%20Discord)](https://discord.gg/jRrnwqMfkr)

### Website https://coh2stats.com/

With all the data, player cards, leaderboards, maps, stats, commanders, inte-bulletins and much more!

### Desktop App [here](packages/app/README.md)

For current match details, player information and other features.

This project is set to create new usage charts for the game COH2.
And also create web access to leaderboards, player cards and recent matches for players.
The author of the game doesn't provide any global statistics. And online leaderboards has been shutdown recently.

This project is inspired by coh2chart.com which has data
only for years 2016-2017 after which it was shut down.

### Open source data

For open source data visit www.coh2stats.com/other/open-data

_In case you will use the data, please mention the source and give a shout-out to the website coh2stats.com, thank you!_

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

`master` branch is automatically deployed to https://dev.coh2stats.com

### Development

The repository is yarn workspace. Use `yarn` to manage this.
Do `yarn install` from the project root to install dependencies.

To run beautifier and linting:
`yarn fix`

Use Node version 16.x or as described in `/packages/functions/package.json`

#### Web

- To start local web dev: `yarn web dev`
- Test: `yarn web test` (located in `packages/web/src/tests`)
- Build: `yarn web build`

#### Docker

The project includes a Dockerfile at the root for containerized deployment:

```bash
# Build the Docker image
yarn docker:build
# or
docker build -t coh2stats-web .

# Run the container
yarn docker:run
# or
docker run -p 3000:3000 coh2stats-web
```

The Dockerfile handles the Yarn workspaces monorepo structure and uses the root `yarn.lock` file.

#### Functions

BE has been moved to repo `coh2-stats-be`

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

### Images for maps

Provided by [Janne252](https://github.com/Janne252) https://github.com/Janne252/coh2-replay-discord-bot/tree/master/data/scenario-preview-images  
For mass reformats from .png to .webp - use Infraview https://www.irfanview.com/ (best image utility)

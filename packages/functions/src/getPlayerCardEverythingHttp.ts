import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getSteamPlayerSummaries } from "./libs/steam-api";
import { getPlayerStatsFromRelic } from "./libs/players/players";
import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";
import { allowedCrossOrigins } from "./config";

import * as stream from "stream";
import * as zlib from "zlib";

import * as cors from "cors";
import * as express from "express";

const app = express();
const corsOptions = {
  origin: allowedCrossOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  res.set("Content-Encoding", "br");

  functions.logger.info(`Getting personal stats for ${JSON.stringify(req.query)}`);

  const steamID: string = (req.query.steamid as string) || "";

  if (!steamID) {
    res.status(500).send("The function must be called with query ?steamID=4981651654");
  }

  try {
    const PromiseRelicData = getPlayerStatsFromRelic(steamID);
    const PromiseSteamProfile = getSteamPlayerSummaries([steamID]);
    const PromisePlayerMatches = getAndPrepareMatchesForPlayer(`/steam/${steamID}`, false);
    const [relicData, steamProfile, playerMatches] = await Promise.all([
      PromiseRelicData,
      PromiseSteamProfile,
      PromisePlayerMatches,
    ]);

    const inputData = {
      relicPersonalStats: relicData,
      steamProfile: steamProfile,
      playerMatches: playerMatches,
    };

    const stringifiedData = JSON.stringify(inputData);

    const inputStream = new stream.Readable(); // Create the stream
    inputStream.push(stringifiedData); // Push the data
    inputStream.push(null); // End the stream data

    const passTrough = new stream.PassThrough();

    const brotli = zlib.createBrotliCompress({
      chunkSize: 32 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: stringifiedData.length,
      },
    });

    inputStream.pipe(brotli).pipe(passTrough);

    passTrough.on("data", (data: any) => {
      res.write(data);
    });

    passTrough.on("end", () => {
      res.end();
    });
  } catch (e) {
    functions.logger.error(e);
    res.status(500).send(`Error calling calling the API ${e}`);
  }
});

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 120,
  memory: "128MB",
};

/**
 * Returns{
 *   relicPersonalStats: {},
 *   steamProfile: {}
 *   playerMatches: {}
 * }
 */
const getPlayerCardEverythingHttp = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(app);

export { getPlayerCardEverythingHttp };

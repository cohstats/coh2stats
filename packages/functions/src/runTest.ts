/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
// import { firestore } from "firebase-admin";
// import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
// import { getLastWeekTimeStamps } from "./libs/helpers";
// import { runAndSaveMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";
import { getSteamPlayerSummaries } from "./libs/steam-api";
// import { ProcessedMatch } from "./libs/types";

// const db = firestore();

const runtimeOpts: Record<string, "256MB" | any> = {
  timeoutSeconds: 540,
  memory: "256MB",
};

const runTest = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    const result = await getSteamPlayerSummaries(["76561197960435530", "76561198034318060"]);
    console.log(result);
    response.send("Finished running test functions");
  });

export { runTest };

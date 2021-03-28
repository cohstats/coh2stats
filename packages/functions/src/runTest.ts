/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
// import { firestore } from "firebase-admin";
// import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
// import { getLastWeekTimeStamps } from "./libs/helpers";
import { runAndSaveMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";
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
    try {
      await runAndSaveMultiDayAnalysis(new Date(2021, 2, 12));
    } catch (e) {
      console.log(e);
    }

    response.send("Finished running test functions");
  });

export { runTest };

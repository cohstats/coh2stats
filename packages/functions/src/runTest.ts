/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";

import { getDateTimeStampInterval, printUTCTime } from "./libs/helpers";
import { ProcessedMatch } from "./libs/types";
import { getMatchCollectionRef } from "./fb-paths";
import { analyzeAndSaveTopMatchStats } from "./libs/analysis/analysis";

// const db = firestore();

const runtimeOpts: Record<string, "1GB" | any> = {
  timeoutSeconds: 540,
  memory: "1GB",
};

const runTest = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    for (let i = 1; i < 17; i++) {
      const { start, end } = getDateTimeStampInterval(i);

      const matches: Array<ProcessedMatch> = [];

      const snapshot = await getMatchCollectionRef()
        .where("startgametime", ">=", start)
        .where("startgametime", "<=", end)
        .get();

      snapshot.forEach((doc) => {
        matches.push(doc.data() as ProcessedMatch);
      });

      functions.logger.info(
        `Retrieved ${matches.length} matches which started between ${printUTCTime(
          start,
        )}, ${start} and ${printUTCTime(end)}, ${end} for analysis.`,
      );

      await analyzeAndSaveTopMatchStats(matches, start);

      functions.logger.info(`Analysis for the date ${printUTCTime(start)} finished.`);
    }

    response.send("Finished running test functions");
  });

export { runTest };

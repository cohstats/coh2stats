/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";

//import {runAndSaveMultiDayAnalysis} from "./libs/analysis/multi-day-analysis";
import { getDateTimeStampInterval, printUTCTime } from "./libs/helpers";
import { getMatchCollectionRef } from "./fb-paths";
import { ProcessedMatch } from "./libs/types";
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
    // await runAndSaveMultiDayAnalysis(new Date(2021, 2, 12), "month", "top");

    for (let i = 1; i < 2; i++) {
      const { start, end } = getDateTimeStampInterval(i, new Date(2021, 3));

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

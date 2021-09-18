import * as functions from "firebase-functions";
import { getMatchCollectionRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { ProcessedMatch } from "./libs/types";
import { getYesterdayDateTimeStampInterval, printUTCTime } from "./libs/helpers";
import {
  analyzeAndSaveMapStats,
  analyzeAndSaveMatchStats,
  analyzeAndSaveTopMatchStats,
} from "./libs/analysis/analysis";
import { analysisChecker } from "./libs/analysis/analysis-checker";
import { removeOldMatches } from "./libs/matches/matches";

const runtimeOpts: Record<string, "1GB" | any> = {
  timeoutSeconds: 540,
  memory: "1GB",
};

/**
 * This functions is run everyday at 3 AM, exactly 1 hour after getting all the matches.
 * It's necessary that this function runs later than getting and saving the matches.
 */
const runAnalysis = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .pubsub.schedule("0 3 * * *")
  .timeZone("Etc/UTC")
  .onRun(async (_) => {
    const { start, end } = getYesterdayDateTimeStampInterval();

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

    await analyzeAndSaveMatchStats(matches, start);

    await analyzeAndSaveTopMatchStats(matches, start);

    await analyzeAndSaveMapStats(matches, start);

    await analysisChecker();

    functions.logger.info(`Analysis for the date ${printUTCTime(start)} finished.`);

    // Clean memory before another memory heavy task
    try {
      if (global.gc) {
        global.gc();
        functions.logger.info(`The memory should be cleared now.`);
      }
    } catch (e) {
      functions.logger.error(`Garage collector is not available`, e);
    }

    // Do DB clean up, we keep only matches which are less than 63 days old
    try {
      await removeOldMatches(14);
    } catch (e) {
      functions.logger.error(`There was an error deleting the old matches`, e);
    }
  });

export { runAnalysis };

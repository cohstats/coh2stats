import * as functions from "firebase-functions";
import { getMatchCollectionRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { ProcessedMatch } from "./libs/types";
import { getYesterdayDateTimeStampInterval, printUTCTime } from "./libs/helpers";
import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
import { analysisChecker } from "./libs/analysis/analysis-checker";

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

    await analysisChecker();

    functions.logger.info(`Analysis for the date ${printUTCTime(start)} finished.`);
  });

export { runAnalysis };

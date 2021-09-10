/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
// import {removeOldMatches} from "./libs/matches/matches";

// //import {runAndSaveMultiDayAnalysis} from "./libs/analysis/multi-day-analysis";
// import { getDateTimeStampInterval, printUTCTime } from "./libs/helpers";
// import { getMatchCollectionRef } from "./fb-paths";
// import { ProcessedMatch } from "./libs/types";
// import { analyzeAndSaveMatchStats, analyzeAndSaveTopMatchStats } from "./libs/analysis/analysis";
// import { runAndSaveMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";
// import {getMatchCollectionRef} from "./fb-paths";
// import {start} from "repl";
// import {getHoursOldTimestamp} from "./libs/helpers";
// import { removeOldMatches } from "./libs/matches/matches";

const runtimeOpts: Record<string, "1GB" | any> = {
  timeoutSeconds: 540,
  memory: "1GB",
};

const runTest = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {



    // await removeOldMatches(78);

    // const statsSnapshot = await getStatsDocRef("1615161600", "daily").get()
    // const ladderSnapshot = await getLadderDocRef("1615161600", "team4", "axis").get()
    // const matchSnapshot = await getMatchDocRef("257094533").get();
    //
    //
    // const data = statsSnapshot.data();
    // const statsBytes = sizeOfDoc(data);
    //
    //
    // const ladderDAta = ladderSnapshot.data();
    // const ladderBytes = sizeOfDoc(ladderDAta);
    //
    // const mathcData = matchSnapshot.data();
    // const matchBytes = sizeOfDoc(mathcData);
    //
    // response.send({
    //   statsBytes,
    //   ladderBytes,
    //   matchBytes
    // });
    // await runAndSaveMultiDayAnalysis(new Date(2021, 2, 12), "month", "top");
    // await runAndSaveMultiDayAnalysis(1620345600000, "week", "normal");
    // await runAndSaveMultiDayAnalysis(1620345600000, "week", "top");
    // for (let i = 1; i < 9; i++) {
    //   functions.logger.info("Start analysis for one day");
    //
    //   const { start, end } = getDateTimeStampInterval(i);
    //
    //   const matches: Array<ProcessedMatch> = [];
    //
    // console.log("Recieved ", request.body.days);
    //
    // try {
    //   await removeOldMatches(request.body.days);
    // } catch (e) {
    //   console.error("There was an error deleting the old data", e);
    // }
    //
    //   snapshot.forEach((doc) => {
    //     matches.push(doc.data() as ProcessedMatch);
    //   });
    //
    //   functions.logger.info(
    //     `Retrieved ${matches.length} matches which started between ${printUTCTime(
    //       start,
    //     )}, ${start} and ${printUTCTime(end)}, ${end} for analysis.`,
    //   );
    //
    //   await analyzeAndSaveMatchStats(matches, start);
    //   await analyzeAndSaveTopMatchStats(matches, start);
    //
    //   functions.logger.info("Finished analysis for one day");
    // }
  });

export { runTest };

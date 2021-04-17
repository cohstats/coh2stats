/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { firestore } from "firebase-admin";
// import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
// import { getLastWeekTimeStamps } from "./libs/helpers";
// import { runAndSaveMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";
// import { getSteamPlayerSummaries } from "./libs/steam-api";
// import { runAndSaveMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";
import { getLadderNameIDsForTimestamp } from "./libs/ladder-data";
import { getYesterdayDateTimestamp } from "./libs/helpers";
import { ProcessedMatch } from "./libs/types";
import { getMatchCollectionRef } from "./fb-paths";
import { analyzeTopMatches } from "./libs/analysis/match-analysis";
// import {getYesterdayDateTimestamp} from "./libs/helpers";
// import { ProcessedMatch } from "./libs/types";

const db = firestore();

const runtimeOpts: Record<string, "1GB" | any> = {
  timeoutSeconds: 540,
  memory: "1GB",
};

const runTest = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    // const result = await getSteamPlayerSummaries(["76561197960435530", "76561198034318060"]);
    // console.log(result);

    // await runAndSaveMultiDayAnalysis(new Date(2021, 2, 25), "week");

    // const { start, end } = getYesterdayDateTimeStampInterval();

    const matches: Array<ProcessedMatch> = [];

    const snapshot = await getMatchCollectionRef()
      .where("startgametime", ">=", 1618080715)
      .where("startgametime", "<=", 1618519935)
      .get();

    snapshot.forEach((doc) => {
      matches.push(doc.data() as ProcessedMatch);
    });

    const timestamp = getYesterdayDateTimestamp();

    const ladderIDs = await getLadderNameIDsForTimestamp(timestamp);

    console.log(`got ${matches.length} matches, for timestamp ${timestamp}`);

    const stats = analyzeTopMatches(matches, ladderIDs);

    await db
      .collection("stats")
      .doc("daily")
      .collection(`${timestamp}`)
      .doc("topStats")
      .set(stats);

    response.send("Finished running test functions");
  });

export { runTest };

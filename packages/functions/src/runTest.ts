/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 * However there is some shit which we need to test online...
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";

// import * as zlib from "zlib";
// import { getPlayerStatsFromRelic } from "./libs/players/players";
// import { getSteamPlayerSummaries } from "./libs/steam-api";
// import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";
//
// import * as stream from "stream";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 540,
  memory: "128MB",
};

const runTest = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    // response.set("Access-Control-Allow-Origin", "*");
    // response.set("Access-Control-Allow-Methods", "GET");
    // response.set("content-encoding", "br");
    //
    // const steamID: string = <string>request.query.steamid || "";
    //
    // const PromiseRelicData = getPlayerStatsFromRelic(steamID);
    // const PromiseSteamProfile = getSteamPlayerSummaries([steamID]);
    // const PromisePlayerMatches = getAndPrepareMatchesForPlayer(`/steam/${steamID}`, false);
    // const [relicData, steamProfile, playerMatches] = await Promise.all([
    //   PromiseRelicData,
    //   PromiseSteamProfile,
    //   PromisePlayerMatches,
    // ]);
    //
    // const inputData = {
    //   relicPersonalStats: relicData,
    //   steamProfile: steamProfile,
    //   playerMatches: playerMatches,
    // };
    //
    // const stringifiedData = JSON.stringify(inputData);
    //
    // const inputStream = new stream.Readable(); // Create the stream
    // inputStream.push(stringifiedData); // Push the data
    // inputStream.push(null); // End the stream data
    //
    // const passTrough = new stream.PassThrough();
    //
    // const brotli = zlib.createBrotliCompress({
    //   chunkSize: 32 * 1024,
    //   params: {
    //     [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    //     [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    //     [zlib.constants.BROTLI_PARAM_SIZE_HINT]: stringifiedData.length,
    //   },
    // });
    //
    // inputStream.pipe(brotli).pipe(passTrough);
    //
    // passTrough.on("data", (data) => {
    //   response.write(data);
    // });
    //
    // passTrough.on("end", () => {
    //   response.end();
    // });
    //
    //
    // zlib.brotliCompress(
    //   stringifiedData,
    //   {
    //   chunkSize: 32 * 1024,
    //     params: {
    //       [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    //       [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    //       [zlib.constants.BROTLI_PARAM_SIZE_HINT]: stringifiedData.length
    //     }
    // }, ((error, result) => {
    //   if(error){
    //     console.error("Error", error)
    //     response.status(500).end()
    //   }
    //   response.set("content-encoding", "br")
    //   response.send(result);
    // }))
    // response.send("finished");
    // for (let i = 1; i <= 31; i++) {
    //   const { start } = getDateTimeStampInterval(i, new Date(1628553600 * 1000));
    //   await removeLadderExceptMonday(new Date(start * 1000));
    // }
    //
    // await removeOldLadder(60);
    // const test = await getAndSaveAllLadders();
    //
    // response.send("finished");
    // const matchDates = [18, 17, 16, 15, 14, 13, 12, 11];
    //
    // for (const date of matchDates) {
    //   const { start, end } = getDateTimeStampInterval(date);
    //
    //   const matches: Array<ProcessedMatch> = [];
    //
    //   const snapshot = await getMatchCollectionRef()
    //     .where("startgametime", ">=", start)
    //     .where("startgametime", "<=", end)
    //     .get();
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
    //   const analysis = analyzeMatchesByMaps(matches);
    //
    //   await saveMapAnalysis(analysis, start);
    // }
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
    // response.send("finished");
  });

export { runTest };

import * as functions from "firebase-functions";
import { getMatchCollectionRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { ProcessedMatch } from "./libs/types";
import { getYesterdayDateTimeStampInterval, printUTCTime } from "./libs/helpers";
import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";

const runtimeOpts: Record<string, "256MB" | any> = {
    timeoutSeconds: 540,
    memory: "256MB",
};

const runAnalysis = functions
    .region(DEFAULT_FUNCTIONS_LOCATION)
    .runWith(runtimeOpts)
    .https.onRequest(async (request, response) => {
        const { start, end } = getYesterdayDateTimeStampInterval();

        const matches: Array<ProcessedMatch> = [];

        const snapshot = await getMatchCollectionRef()
            .where("startgametime", ">=", start)
            .where("startgametime", "<=", end)
            .get();

        snapshot.forEach((doc) => {
            matches.push(doc.data() as ProcessedMatch);
        });

        functions.logger.log(
            `Retrieved ${matches.length} matches which started between ${printUTCTime(
                start,
            )}, ${start} and ${printUTCTime(end)}, ${end} for analysis.`,
        );

        await analyzeAndSaveMatchStats(matches, start);

        functions.logger.log(`Analysis for the date ${printUTCTime(start)} finished.`);
        response.send("Finished analysis");
    });

export { runAnalysis };

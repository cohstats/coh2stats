import { getStatsDocRef } from "../../fb-paths";
import { ProcessedMatch, StatDict } from "../types";
import { analyzeMatches } from "./match-analysis";
import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { sumValuesOfObjects } from "../helpers";
import { globallyAnalyzedMatches } from "../global-stats";

const db = firestore();

/**
 * Save analysis does UPDATE on analysis file. It doesn't overwrite it!
 * Be careful when running day analysis again and again.
 * Consider changing this to re-write.
 * @param stats
 * @param timestamp
 * @param statType
 */
const saveAnalysis = async (
    stats: Record<string, any>,
    timestamp: number,
    statType: "daily" = "daily",
) => {
    const statRef = getStatsDocRef(timestamp, statType);
    try {
        // This stat object will be updated in parallel based on how many
        // threads (functions) for processing the will run;
        await db.runTransaction(async (t) => {
            const statDoc = await t.get(statRef);
            let data = statDoc.data();
            if (data == undefined) {
                data = {};
            }
            data = sumValuesOfObjects(data as StatDict, stats);
            t.set(statRef, data);
        });
    } catch (e) {
        functions.logger.error(
            `Failed to save new analysis stats into ${statRef.path}`,
            timestamp,
            stats,
            e,
        );
    }
};

const analyzeAndSaveMatchStats = async (
    matches: Array<ProcessedMatch>,
    dateTimeStamp: number,
): Promise<void> => {
    functions.logger.log(`Stats - analyzing ${matches.length} matches.`);
    const stats = analyzeMatches(matches);
    functions.logger.log(`Stats analyzed, going to save them.`);
    await globallyAnalyzedMatches(matches.length);
    await saveAnalysis(stats, dateTimeStamp);
};

export { analyzeAndSaveMatchStats };

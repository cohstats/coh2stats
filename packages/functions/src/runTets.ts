/**
 * FYI: We should not run any tests in cloud. We should have tests in emulators.
 */
import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { firestore } from "firebase-admin";
import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
import { getCurrentDateTimestamp } from "./libs/helpers";
import { ProcessedMatch } from "./libs/types";

const db = firestore();

const runtimeOpts: Record<string, "256MB" | any> = {
    timeoutSeconds: 540,
    memory: "256MB",
};

const runTest = functions
    .region(DEFAULT_FUNCTIONS_LOCATION)
    .runWith(runtimeOpts)
    .https.onRequest(async (request, response) => {
        const matchesRef = db.collection("matches");
        const snapshot = await matchesRef.where("startgametime", ">", 1610754000).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        console.log("Found documents: ", snapshot.size);

        const result: Array<ProcessedMatch> = [];

        snapshot.forEach((doc) => {
            result.push(doc.data() as ProcessedMatch);
        });

        await analyzeAndSaveMatchStats(result, getCurrentDateTimestamp());
        await analyzeAndSaveMatchStats(result, getCurrentDateTimestamp());
        response.send("Finished running test functions");
    });

export { runTest };

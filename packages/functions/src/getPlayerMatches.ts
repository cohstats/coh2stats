import * as functions from "firebase-functions";
import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";
import { firestore } from "firebase-admin";
import { getMatchDocRef, getMatchStatsDocRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION, PUBSUB_TOPIC_DOWNLOAD_MATCHES } from "./constants";
import { analyzeAndSaveMatchStats } from "./libs/analysis/analysis";
import { getCurrentDateTimestamp } from "./libs/helpers";
import { ProcessedMatch } from "./libs/types";

const runtimeOpts: Record<string, "256MB" | any> = {
    timeoutSeconds: 540,
    memory: "256MB",
};

const db = firestore();

/**
 * Saves matches to the DB using a batch request.
 * @param matches
 */
const saveMatches = async (matches: Set<Record<string, any>>) => {
    if (matches.size === 0) {
        return;
    }

    const matchStatsRef = getMatchStatsDocRef();
    const increment = firestore.FieldValue.increment(matches.size);

    let batch = db.batch();
    let counter = 0;

    for (const match of matches) {
        const docRef = getMatchDocRef(match.id);
        batch.set(docRef, match);
        batch.set(matchStatsRef, { matchCount: increment }, { merge: true });
        counter++;
        // We can write at most 500 requests in a single batch
        if (counter % 498 == 0 && counter != matches.size) {
            await batch.commit();
            batch = db.batch();
        }

        if (counter == matches.size) {
            await batch.commit();
        }
    }

    functions.logger.log(`Saved ${matches.size} matches to the DB.`);
};

/**
 * Expected message:
 *  {
 *      "profileNames": ["/steam/76561198034318060","/steam/76561198812932249"]
 *  }
 *
 */
const getPlayerMatches = functions
    .region(DEFAULT_FUNCTIONS_LOCATION)
    .runWith(runtimeOpts)
    .pubsub.topic(PUBSUB_TOPIC_DOWNLOAD_MATCHES)
    .onPublish(async (message) => {
        const profileNames = message.json.profileNames;
        functions.logger.log(`Received these profile names ${profileNames}`);

        let matches: Set<ProcessedMatch> = new Set();

        for (const profileName of profileNames) {
            // We don't expect that played would be able to play more than 50 games
            const playerMatches = await getAndPrepareMatchesForPlayer(profileName);
            matches = new Set([...matches, ...playerMatches]);
        }

        await saveMatches(matches);
        const matchesAsArray = [...matches];
        await analyzeAndSaveMatchStats(matchesAsArray, getCurrentDateTimestamp());
    });

export { getPlayerMatches };

import * as functions from "firebase-functions";
import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";
import { firestore } from "firebase-admin";
import { getGlobalStatsDocRef, getMatchDocRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION, PUBSUB_TOPIC_DOWNLOAD_MATCHES } from "./constants";
import { ProcessedMatch } from "./libs/types";

const runtimeOpts: Record<string, "512MB" | any> = {
    timeoutSeconds: 540,
    memory: "512MB",
};

const db = firestore();

/**
 * Saves matches to the DB using a batch request.
 * @param matches
 */
const saveMatches = async (matches: Array<ProcessedMatch>) => {
    if (matches.length === 0) {
        return;
    }

    const matchStatsRef = getGlobalStatsDocRef();
    const increment = firestore.FieldValue.increment(matches.length);

    let batch = db.batch();
    let counter = 0;

    for (const match of matches) {
        const docRef = getMatchDocRef(match.id);
        batch.set(docRef, match);
        counter++;
        // We can write at most 500 requests in a single batch
        if (counter % 498 == 0 && counter != matches.length) {
            await batch.commit();
            functions.logger.info(`Saving batch of ${counter} matches to the DB.`);
            batch = db.batch();
        }

        if (counter == matches.length) {
            // Match count is not accurate / we can't detect re-writes during batch write
            batch.set(matchStatsRef, { matchCount: increment }, { merge: true });
            await batch.commit();
            functions.logger.info(`Saving batch of ${counter} matches to the DB.`);

        }
    }

    functions.logger.info(`Saved ${matches.length} matches to the DB.`);
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

        let matches: Record<string, any> = {};
        let duplicatesCounter = 0;

        for (const profileName of profileNames) {
            const playerMatches = await getAndPrepareMatchesForPlayer(profileName);

            for(const match of playerMatches){
                if(Object.prototype.hasOwnProperty.call(matches, match.id)){
                    duplicatesCounter++;
                } else {
                    matches[match.id] = match;
                }
            }
        }

        const matchesArray = Object.values(matches);
        functions.logger.info(`Skipped ${duplicatesCounter}/${matchesArray.length + duplicatesCounter} matches as duplicates.`);

        await saveMatches(matchesArray);
        /**
         * Warning: We can't do analysis here because we might process duplicated matches.
         * Why is that? Because this function has only matches for a specific players (from which
         * it removes duplicates) but the match can be already processed because the same match
         * is processed by each player who played in that match!
         */
    });

export { getPlayerMatches };

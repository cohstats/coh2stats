import * as functions from "firebase-functions";
import {getAndPrepareMatchesForPlayer} from "./libs/matches/matches";
import {firestore} from "firebase-admin";
import {getMatchDocRef} from "./fb-paths";
import {DEFAULT_FUNCTIONS_LOCATION, PUBSUB_TOPIC_DOWNLOAD_MATCHES} from "./constants";

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '256MB'
}

const db = firestore();

/**
 * Saves matches to the DB using a batch request.
 * @param matches
 */
const saveMatches = async (matches: Set<Record<string, any>>) => {
    if (matches.size === 0) {
        return;
    }

    let batch = db.batch();
    let counter = 0;

    for (const match of matches) {
        const docRef = getMatchDocRef(match.id)
        batch.set(docRef, match);
        counter++;
        // We can write at most 500 requests in a single batch
        if(counter % 498 == 0 && counter != matches.size){
            await batch.commit();
            batch = db.batch();
        }

        if(counter == matches.size){
            await batch.commit();
        }
    }


    functions.logger.log(`Saved ${matches.size} matches to the DB.`)
}


/**
 * Expected message:
 *  {
 *      "profileNames": ["/steam/76561198034318060","/steam/76561198812932249"]
 *  }
 *
 */
const getPlayerMatches = functions
    .region(DEFAULT_FUNCTIONS_LOCATION)
    // @ts-ignore
    .runWith(runtimeOpts)
    .pubsub.topic(PUBSUB_TOPIC_DOWNLOAD_MATCHES).onPublish(async (message) => {

        const profileNames = message.json.profileNames;
        functions.logger.log(`Received these profile names ${profileNames}`);

        let matches: Set<Record<string, any>> = new Set();

        for (const profileName of profileNames) {
            // We don't expect that played would be able to play more than 50 games
            const playerMatches = await getAndPrepareMatchesForPlayer(profileName)
            matches = new Set([...matches, ...playerMatches]);
        }

        await saveMatches(matches);

    });

export {
    getPlayerMatches
}

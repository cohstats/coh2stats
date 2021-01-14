import * as functions from "firebase-functions";
import {getAndPrepareMatchesForPlayer} from "./libs/matches/matches";
import {firestore} from "firebase-admin";
import {getMatchDocRef} from "./fb-paths";


const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '256MB'
}

const db = firestore();

/**
 * Can save at most 500 items. Otherwise it's going to fail due to batch;
 * @param matches
 */
const saveMatches = async (matches: Set<Record<string, any>>) => {
    if(matches.size === 0){
        return;
    }

    const batch = db.batch();

    for(const match of matches){
        const docRef = getMatchDocRef(match.id)
        batch.set(docRef, match);
    }

    await batch.commit();
    functions.logger.log(`Saved ${matches.size} matches to the DB.`)
}


/**
 * Expected body request:
 *  {
 *      "profileNames": ["/steam/76561198034318060","/steam/76561198812932249"]
 *  }
 *
 */
const getPlayerMatches = functions
    // @ts-ignore
    .runWith(runtimeOpts).https.onRequest(async (request, response) => {
        // This function should allow only internal GCP traffic on this function - looks like it can't be done via code

        functions.logger.log(`Request body ${JSON.stringify(request.body)}`);

        const profileNames = request.body["profileNames"];
        functions.logger.log(`Received these profile names ${profileNames}`);

        let matches: Set<Record<string, any>> = new Set();

        for(const profileName of profileNames){
            // We don't expect that played would be able to play more than 50 games
            const playerMatches = await getAndPrepareMatchesForPlayer(profileName)
            matches = new Set([...matches, ...playerMatches]);
        }

        await saveMatches(matches);

        response.send(`Finished downloading and saving ${matches.size} matches for ${profileNames.length} profiles`);
    });

export {
    getPlayerMatches
}

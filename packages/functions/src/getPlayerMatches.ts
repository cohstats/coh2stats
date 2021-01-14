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
 * Can save at most 500 items. Otherwise it's going to fail.
 * @param matches
 */
const saveMatches = async (matches: Array<Record<string, any>>) => {
    const batch = db.batch();

    for(const match of matches){
        const docRef = getMatchDocRef(match.id)
        batch.set(docRef, match);
    }

    await batch.commit();
    functions.logger.log(`Saved ${matches.length} matches to the DB.`)
}



const getPlayerMatches = functions
    // @ts-ignore
    .runWith(runtimeOpts).https.onRequest(async (request, response) => {
        // Do we want to have any validation here? Who can trigger this function? Hm??

        //const profileNames = request.body.text
        functions.logger.log(`Request body ${JSON.stringify(request.body)}`);


        const matches = await getAndPrepareMatchesForPlayer("/steam/76561198034318060");

        console.log(`Recieved ${matches.length}`)

        await saveMatches(matches);

        response.send("Finished downloading all matches");
    });

export {
    getPlayerMatches
}

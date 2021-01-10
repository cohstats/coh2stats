import * as functions from "firebase-functions";
import {getAndPrepareMatchesForPlayer} from "./libs/matches/matches";

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '256MB'
}




const getPlayerMatches = functions
    // @ts-ignore
    .runWith(runtimeOpts).https.onRequest(async (request, response) => {
        // Do we want to have any validation here? Who can trigger this function? Hm??

        //const profileNames = request.body.text
        functions.logger.log(`Request body ${JSON.stringify(request.body)}`);


        const matches = await getAndPrepareMatchesForPlayer("/steam/76561198034318060");

        console.log(`Recieved ${matches.length}`)

        response.send("Finished downloading all matches");
    });

export {
    getPlayerMatches
}

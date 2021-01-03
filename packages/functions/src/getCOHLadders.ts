import axios from "axios";
import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";

import {getLadderUrl, leaderboardsID} from "./libs/coh2api";
import {getCurrentDateTimestamp} from "./libs/helpers";

const AMOUNT_OF_LINES = 200; // 200 is max

const getLadderStats = async (leaderboardID: number) => {
    const response = await axios.get(getLadderUrl(leaderboardID, AMOUNT_OF_LINES));

    if (response.status == 200) {
        let data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data
    }
}


const extractTheIDs = (data: Record<string, any>) => {
    const profileIDs = new Set();

    const {statGroups} = data;

    for(const group of statGroups){
        for(const member in group["members"]){
            const name = group[member]["name"];
            profileIDs.add(name);
        }
    }

    return profileIDs;
}

/**
 * We could do all operations at once and use batch to write it to the DB.
 * But we don't really need to stress the COH API that much. Speed is not factor here
 * so doing it one by one is OK in this case.
 */
const getAndSaveAllLadders = async () => {

    const currentDateTimeStamp = getCurrentDateTimestamp();

    for (const typeOfGame in leaderboardsID) {

        // WTF is this shit?
        // @ts-ignore
        for (const faction in leaderboardsID[typeOfGame]) {
            // @ts-ignore
            const id = leaderboardsID[typeOfGame][faction];
            functions.logger.log(`Processing ${typeOfGame} - ${faction}, using leaderBoardID: ${id}`)

            try {
                const data = await getLadderStats(id);

                const collectionPath = `ladders/${currentDateTimeStamp}/${typeOfGame}`
                functions.logger.log(`Going to save ${data["statGroups"].length} items to DB collection ${collectionPath} for faction ${faction}`);
                await firestore().collection(collectionPath).doc(faction).set(data);

            } catch (e) {
                functions.logger.error(`Failed to process ${typeOfGame} - ${faction}`, e)
            }
        }
    }
}

// Set max timeout
const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '256MB'
}

/**
 * This function downloads all current ladders and saves them to the DB.
 */
const getCOHLadders = functions
    // @ts-ignore
    .runWith(runtimeOpts).https.onRequest(async (request, response) => {
        // Do we want to have any validation here? Who can trigger this function? Hm??

        await getAndSaveAllLadders();
        response.send("Finished processing the COH ladders");
    });

export {
    getCOHLadders
}



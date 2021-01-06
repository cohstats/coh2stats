import axios from "axios";
import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";

import {getLadderUrl, leaderboardsID} from "./libs/coh2-api";
import {getCurrentDateTimestamp} from "./libs/helpers";
import {extractTheProfileIDs} from "./libs/ladder-data";

const AMOUNT_OF_LINES = 200; // 200 is max

const fetchLadderStats = async (leaderboardID: number): Promise<Record<string, any>> => {
    const response = await axios.get(getLadderUrl(leaderboardID, AMOUNT_OF_LINES));

    if (response.status == 200) {
        let data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data;
    } else {
        throw `Failed to received the ladder stats, response: ${response} `
    }
}

/**
 * We could do all operations at once and use batch to write it to the DB.
 * But we don't really need to stress the COH API that much. Speed is not factor here
 * so doing it one by one is OK in this case.
 */
const getAndSaveAllLadders = async () => {

    const currentDateTimeStamp = getCurrentDateTimestamp();
    let profileIDs = new Set();
    let totalQueriedPositions = 0;

    for (const typeOfGame in leaderboardsID) {

        // WTF is this shit?
        // @ts-ignore
        for (const faction in leaderboardsID[typeOfGame]) {
            // @ts-ignore
            const id = leaderboardsID[typeOfGame][faction];
            functions.logger.log(`Processing ${typeOfGame} - ${faction}, using leaderBoardID: ${id}`)

            // Total positions we queried on the ladder
            totalQueriedPositions += AMOUNT_OF_LINES;

            try {
                const data = await fetchLadderStats(id);
                const extractedIds = extractTheProfileIDs(data);``

                functions.logger.log(`Extracted ${extractedIds} unique profile IDs`);
                profileIDs = new Set([...profileIDs, ...extractedIds]);

                const collectionPath = `ladders/${currentDateTimeStamp}/${typeOfGame}`
                functions.logger.log(`Going to save ${data["statGroups"].length} items to DB collection ${collectionPath} for faction ${faction}`);
                await firestore().collection(collectionPath).doc(faction).set(data);

            } catch (e) {
                functions.logger.error(`Failed to process ${typeOfGame} - ${faction}`, e)
            }
        }
    }

    functions.logger.info(`Finished processing all ladders, extracted ${profileIDs.size} unique player profiles out of ${totalQueriedPositions} positions.`);
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



import axios from "axios";
import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";

import { getLadderUrl, leaderboardsID } from "./libs/coh2-api";
import { getCurrentDateTimestamp } from "./libs/helpers";
import { extractTheProfileIDs } from "./libs/ladder-data";

import { DEFAULT_FUNCTIONS_LOCATION, PUBSUB_TOPIC_DOWNLOAD_MATCHES } from "./constants";

const pubSubClient = new PubSub();
const AMOUNT_OF_QUERIED_PLAYERS = 200; // 200 is max
const CHUNK_PROFILES_TO_PROCESS = 40; // This specifies how many profiles we can will process in one request

const fetchLadderStats = async (leaderboardID: number): Promise<Record<string, any>> => {
    const response = await axios.get(getLadderUrl(leaderboardID, AMOUNT_OF_QUERIED_PLAYERS));

    if (response.status == 200) {
        const data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data;
    } else {
        throw Error(`Failed to received the ladder stats, response: ${response}`);
    }
};

const invokeGetPlayerMatches = async (profileIds: Array<string>) => {
    functions.logger.debug(`Going to publish profiles into PubSub ${profileIds}`);
    const dataBuffer = Buffer.from(JSON.stringify({ profileNames: profileIds }));

    try {
        const messageId = await pubSubClient
            .topic(PUBSUB_TOPIC_DOWNLOAD_MATCHES)
            .publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
    }
};

const callGetPlayerMatches = async (profileIds: Set<string>) => {
    const chunkSize = CHUNK_PROFILES_TO_PROCESS;
    const profileIdsArray = [...profileIds];

    let chunkArray: Array<string> = [];

    for (let i = 0; i < profileIds.size; i++) {
        chunkArray.push(profileIdsArray[i]);
        if (i % chunkSize == 0 || i == profileIds.size - 1) {
            await invokeGetPlayerMatches(chunkArray);
            chunkArray = [];
        }
    }
};

/**
 * We could do all operations at once and use batch to write it to the DB.
 * But we don't really need to stress the COH API that much. Speed is not factor here
 * so doing it one by one is OK in this case.
 */
const getAndSaveAllLadders = async () => {
    const currentDateTimeStamp = getCurrentDateTimestamp();
    let profileIDs: Set<string> = new Set();
    let totalQueriedPositions = 0;

    for (const typeOfGame in leaderboardsID) {
        for (const faction in leaderboardsID[typeOfGame]) {
            const id = leaderboardsID[typeOfGame][faction];
            functions.logger.log(
                `Processing ${typeOfGame} - ${faction}, using leaderBoardID: ${id}`,
            );

            // Total positions we queried on the ladder
            totalQueriedPositions += AMOUNT_OF_QUERIED_PLAYERS;

            try {
                const data = await fetchLadderStats(id);
                const extractedIds = extractTheProfileIDs(data);

                functions.logger.log(`Extracted ${extractedIds.size} unique profile IDs`);
                profileIDs = new Set([...profileIDs, ...extractedIds]);

                const collectionPath = `ladders/${currentDateTimeStamp}/${typeOfGame}`;
                functions.logger.log(
                    `Going to save ${data["statGroups"].length} items to DB collection ${collectionPath} for faction ${faction}`,
                );
                await firestore().collection(collectionPath).doc(faction).set(data);
            } catch (e) {
                functions.logger.error(`Failed to process ${typeOfGame} - ${faction}`, e);
            }
        }
    }

    await callGetPlayerMatches(profileIDs);

    functions.logger.info(
        `Finished processing all ladders, extracted ${profileIDs.size} unique player profiles out of ${totalQueriedPositions} positions.`,
    );
};

// Set max timeout we can
const runtimeOpts: Record<string, "256MB" | any> = {
    timeoutSeconds: 540,
    memory: "256MB",
};

/**
 * This function downloads all current ladders and saves them to the DB.
 */
const getCOHLadders = functions
    .region(DEFAULT_FUNCTIONS_LOCATION)
    .runWith(runtimeOpts)
    .https.onRequest(async (request, response) => {
        // Do we want to have any validation here? Who can trigger this function? Hm??

        await getAndSaveAllLadders();
        response.send("Finished processing the COH ladders");
    });

export { getCOHLadders };

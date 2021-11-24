import { getCurrentDateTimestamp } from "../helpers";
import { getLadderUrl, leaderboardsID } from "../coh2-api";
import * as functions from "firebase-functions";
import { extractTheProfileIDs } from "./ladder-data";
import { firestore } from "firebase-admin";
import axios from "axios";
import { PUBSUB_TOPIC_DOWNLOAD_MATCHES } from "../../constants";
import { PubSub } from "@google-cloud/pubsub";
import { RawLaddersObject } from "../types";
import { cleanLaddersData } from "./ladders-clean";
import { Agent } from "https";

const pubSubClient = new PubSub();

// Keep Alive the TCP connection
const httpsAgent = new Agent({ keepAlive: true });

const AMOUNT_OF_QUERIED_PLAYERS = 200; // 200 is max/
const CHUNK_PROFILES_TO_PROCESS = 1100; // This specifies how many profiles we will send to the que in one message
/** CHUNK_PROFILES_TO_PROCESS
 * The chunk of 1k seems to be ideal, the time it takes to process those profiles ~6 minutes.
 * The timeout of the CF is 9 minutes. This gives us ~30% service degradation buffer.
 * The memory needed for this is ~400MB / CF, the limit is 512 MB.
 */
const fetchLadderStats = async (leaderboardID: number, start = 1): Promise<RawLaddersObject> => {
  const response = await axios.get(
    getLadderUrl(leaderboardID, AMOUNT_OF_QUERIED_PLAYERS, start),
    { httpsAgent },
  );

  if (response.status == 200) {
    return response.data;
  } else {
    throw Error(`Failed to received the ladder stats, response: ${response}`);
  }
};

const invokeGetPlayerMatches = async (profileIds: Array<string>) => {
  functions.logger.debug(
    `Going to publish ${profileIds.length} profiles into PubSub ${profileIds}`,
  );
  const dataBuffer = Buffer.from(JSON.stringify({ profileNames: profileIds }));

  try {
    const messageId = await pubSubClient.topic(PUBSUB_TOPIC_DOWNLOAD_MATCHES).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error: any) {
    console.error(`Received error while publishing: ${error.message}`);
  }
};

const callGetPlayerMatches = async (profileIds: Set<string>): Promise<void> => {
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
 *
 * Returns set of profile IDS
 */
const getAndSaveAllLadders = async (): Promise<Set<string>> => {
  const currentDateTimeStamp = getCurrentDateTimestamp();
  let profileIDs: Set<string> = new Set();
  let totalQueriedPositions = 0;

  for (const typeOfGame in leaderboardsID) {
    for (const faction in leaderboardsID[typeOfGame]) {
      const id = leaderboardsID[typeOfGame][faction];
      functions.logger.log(`Processing ${typeOfGame} - ${faction}, using leaderBoardID: ${id}`);

      // Total positions we queried on the ladder
      totalQueriedPositions += AMOUNT_OF_QUERIED_PLAYERS * 3;

      try {
        const data = await fetchLadderStats(id);
        const extractedIds = extractTheProfileIDs(data);

        // second data so we have more ids and matches, but this is not saved to the DB
        const secondData = await fetchLadderStats(id, 200);
        const secondExtractedIds = extractTheProfileIDs(secondData);

        // second data so we have more ids and matches, but this is not saved to the DB
        const thirdData = await fetchLadderStats(id, 400);
        const thirdExtractedIds = extractTheProfileIDs(thirdData);

        functions.logger.log(
          `Extracted ${extractedIds.size} unique profile IDs in top 200, and ${secondExtractedIds.size} in top 200-400 and ${thirdExtractedIds.size} in 400-600 `,
        );

        profileIDs = new Set([
          ...profileIDs,
          ...extractedIds,
          ...secondExtractedIds,
          ...thirdExtractedIds,
        ]);

        const collectionPath = `ladders/${currentDateTimeStamp}/${typeOfGame}`;
        functions.logger.log(
          `Going to save ${data["statGroups"].length} items to DB collection ${collectionPath} for faction ${faction}`,
        );
        const cleanedData = cleanLaddersData(data);

        await firestore().collection(collectionPath).doc(faction).set(cleanedData);
      } catch (e) {
        functions.logger.error(`Failed to process ${typeOfGame} - ${faction}`, e);
      }
    }
  }

  // Save the timestamp also into the document / not just the name of the document - we can't filter on that
  await firestore().collection("ladders").doc(`${currentDateTimeStamp}`).set({
    timeStamp: currentDateTimeStamp,
  });

  functions.logger.info(
    `Finished processing all ladders, extracted ${profileIDs.size} unique player profiles out of ${totalQueriedPositions} positions.`,
  );

  return profileIDs;
};

export { getAndSaveAllLadders, callGetPlayerMatches };

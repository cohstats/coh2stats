import * as functions from "firebase-functions";
import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";
import { firestore } from "firebase-admin";
import { getGlobalStatsDocRef, getMatchDocRef } from "./fb-paths";
import { DEFAULT_FUNCTIONS_LOCATION, PUBSUB_TOPIC_DOWNLOAD_MATCHES } from "./constants";
import { ProcessedMatch } from "./libs/types";

import chunk = require("lodash.chunk");
import { filterOnlyAutomatchVsPlayers } from "./libs/analysis/match-analysis";

const runtimeOpts: Record<string, "512MB" | any> = {
  timeoutSeconds: 540,
  memory: "512MB",
  // we need to lower the amount of instances due to - too many requests
  maxInstances: 1,
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

  const chunkedData = chunk(matches, 499);

  for (const chunk of chunkedData) {
    for (const match of chunk) {
      const docRef = getMatchDocRef(match.id);
      batch.set(docRef, match);
    }

    await batch.commit();
    functions.logger.info(`Saving batch of ${chunk.length} matches to the DB.`);
    batch = db.batch();
  }

  // Match count is not accurate / we can't detect re-writes during batch write
  await matchStatsRef.set({ matchCount: increment }, { merge: true });

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
    const profileNames: Array<string> = message.json.profileNames;
    functions.logger.log(`Received these profile names ${profileNames}`);

    const matches: Record<string, any> = {};
    let duplicatesCounter = 0;

    const chunkedData = chunk(profileNames, 5);

    for (const chunk of chunkedData) {
      const playerMatches = await getAndPrepareMatchesForPlayer(chunk);

      for (const match of playerMatches) {
        if (Object.prototype.hasOwnProperty.call(matches, match.id)) {
          duplicatesCounter++;
        } else {
          matches[match.id] = match;
        }
      }
    }

    let matchesArray = Object.values(matches);
    functions.logger.info(
      `Skipped ${duplicatesCounter}/${
        matchesArray.length + duplicatesCounter
      } matches as duplicates.`,
    );

    // We will not be storing any custom matches, we don't use them for analysis anyway
    const totalMatches = matchesArray.length;
    matchesArray = filterOnlyAutomatchVsPlayers(matchesArray);
    functions.logger.info(
      `Removed ${totalMatches - matchesArray.length} non auto-match matches before saving.`,
    );

    await saveMatches(matchesArray);
    /**
     * Warning: We can't do analysis here because we might process duplicated matches.
     * Why is that? Because this function has only matches for a specific players (from which
     * it removes duplicates) but the match can be already processed because the same match
     * is processed by each player who played in that match!
     */
  });

export { getPlayerMatches };

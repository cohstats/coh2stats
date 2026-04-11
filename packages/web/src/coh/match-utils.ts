/**
 * Match Data Processing Utilities
 *
 * This file contains utility functions for processing and transforming
 * match data from the Relic API. These functions are used to clean up,
 * filter, and prepare match data before storing it in the database.
 */

import { convertSteamNameToID, findProfile } from "./helpers";

/**
 * We want to filter out items we don't need to store.
 *  "itemlocation_id":3 = commander
 *  "itemlocation_id":4 = intel bulletin
 *
 * @param singleMatchData - The match data object
 */
export const filterOutItems = (singleMatchData: Record<string, any>): Record<string, any> => {
  singleMatchData["matchhistoryitems"] = singleMatchData["matchhistoryitems"].filter(
    (item: Record<string, any>) => {
      return item["itemlocation_id"] == 3 || item["itemlocation_id"] == 4;
    },
  );
  return singleMatchData;
};

/**
 * Removes unnecessary items from the items info.
 *
 * @param singleMatchData - The match data object
 */
export const removeExtraDataFromItems = (
  singleMatchData: Record<string, any>,
): Record<string, any> => {
  for (const item of singleMatchData["matchhistoryitems"]) {
    delete item["durabilitytype"];
    delete item["durability"];
    delete item["metadata"];
    delete item["matchhistory_id"]; // We don't need because the object is nested under the match itself
  }

  return singleMatchData;
};

/**
 * Process a single match data object
 *
 * @param singleMatchData - The match data object
 */
export const processSingleMatch = (singleMatchData: Record<string, any>): Record<string, any> => {
  // delete fields we don't need to track
  delete singleMatchData["options"]; // Don't know what this field does, probably don't need it
  delete singleMatchData["slotinfo"]; // Don't know what this field does, probably don't need it
  delete singleMatchData["observertotal"]; // We don't care about this
  delete singleMatchData["matchurls"]; // Don't know, don't care

  singleMatchData = filterOutItems(singleMatchData);
  singleMatchData = removeExtraDataFromItems(singleMatchData);

  return singleMatchData;
};

/**
 * Returns array of player IDs who played in this match.
 * Also removes unnecessary data in the player report.
 *
 * @param singleMatchData - The match data object
 */
export const extractPlayerIDsInMatch = (singleMatchData: Record<string, any>): Array<number> => {
  const playerIds = [];

  for (const player of singleMatchData["matchhistoryreportresults"]) {
    playerIds.push(player["profile_id"]);
    // Also delete these 2 fields we don't need them
    delete player["xpgained"];
    delete player["matchstartdate"];
  }

  return playerIds;
};

/**
 * This function transforms the objects in the profiles for them to be possible to
 * better process / analyze and search in in the DB.
 *
 * Returns steam IDs. This should be theoretically put into the separate function
 * but we can calculate it in one way to save some time.
 *
 * @param singleMatchObject - The match data object
 * @param profiles - Array of profile objects
 */
export const transformProfilesInMatch = (
  singleMatchObject: Record<string, any>,
  profiles: Array<Record<string, any>>,
): Array<string> => {
  const steamIDs = [];

  for (const playerResult of singleMatchObject["matchhistoryreportresults"]) {
    const profile = findProfile(playerResult["profile_id"], profiles);
    playerResult["profile"] = profile;
    steamIDs.push(convertSteamNameToID(profile?.name || ""));
  }

  return steamIDs;
};

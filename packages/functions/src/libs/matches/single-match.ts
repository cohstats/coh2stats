import { convertSteamNameToID, getYesterdayDateTimeStampInterval } from "../helpers";
import { ProcessedMatch } from "../types";

/**
 * We want to filter out items we don't need to store.
 *  "itemlocation_id":3 = commander
 *  "itemlocation_id":4 = intel bulletin
 *
 * @param singleMatchData
 */
const filterOutItems = (singleMatchData: Record<string, any>): Record<string, any> => {
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
 * @param singleMatchData
 */
const removeExtraDataFromItems = (singleMatchData: Record<string, any>): Record<string, any> => {
  for (const item of singleMatchData["matchhistoryitems"]) {
    delete item["durabilitytype"];
    delete item["durability"];
    delete item["metadata"];
    delete item["matchhistory_id"]; // We don't need because the object is nested under the match itself
  }

  return singleMatchData;
};

const processSingleMatch = (singleMatchData: Record<string, any>): Record<string, any> => {
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
 * Returns if the game was played in the last day. We have 25 hours to have some tolerance
 * as the function might not run in the every second and 1 extra hour can give us 1 extra
 * match which doesn't matter as it will not be processed as duplicate.
 * @param singleMatchData
 */
const isLastDayMatch = (singleMatchData: Record<string, any>): boolean => {
  const { start, end } = getYesterdayDateTimeStampInterval();

  return singleMatchData["startgametime"] > start && singleMatchData["startgametime"] < end;
};

/**
 * Returns array of player IDs who played in this match.
 * Also removes unnecessary data in the player report.
 * @param singleMatchData
 */
const extractPlayerIDsInMatch = (singleMatchData: Record<string, any>): Array<number> => {
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
 * Returns the profile based on it's ID from the list of profiles
 * @param profileId
 * @param profiles
 */
const findProfile = (
  profileId: number,
  profiles: Array<Record<string, any>>,
): Record<string, any> | undefined => {
  return profiles.find((profile: Record<string, any>) => {
    return profile["profile_id"] == profileId;
  });
};

/**
 * This function transforms the objects in the profiles for them to be possible to
 * better process / analyze and search in in the DB.
 *
 * Returns steam IDs. This should be theoretically put into the separate function
 * but we can calculate it in one way to save some time. lul
 *
 * @param singleMatchObject
 * @param profiles
 */
const transformProfilesInMatch = (
  singleMatchObject: Record<string, any>,
  profiles: Array<Record<string, any>>,
): Array<string> => {
  const steamIDs = [];

  for (const playerResult of singleMatchObject["matchhistoryreportresults"]) {
    const profile = findProfile(playerResult["profile_id"], profiles);
    playerResult["profile"] = profile;
    steamIDs.push(convertSteamNameToID(profile?.name));
  }

  return steamIDs;
};

/***
 * This is the main function for processing and preparing the single match to be saved in the DB.
 *
 * @param singleMatchData
 * @param profiles
 */
const prepareMatchDBObject = (
  singleMatchData: Record<string, any>,
  profiles: Array<Record<string, any>>,
): ProcessedMatch => {
  const profileIDs = extractPlayerIDsInMatch(singleMatchData);

  // Do all the transformations on the single match object
  singleMatchData = processSingleMatch(singleMatchData);
  const steamIDs = transformProfilesInMatch(singleMatchData, profiles);

  // This is important we are storing profile IDs on the main object so we can filter in DB based on this
  singleMatchData["profile_ids"] = profileIDs;
  singleMatchData["steam_ids"] = steamIDs;

  return singleMatchData as ProcessedMatch;
};

export {
  filterOutItems,
  removeExtraDataFromItems,
  processSingleMatch,
  isLastDayMatch,
  extractPlayerIDsInMatch,
  prepareMatchDBObject,
  findProfile,
};

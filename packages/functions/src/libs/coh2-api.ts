import * as commanderIDsToRacesJSON from "./data/commanderServerData.json";

import * as bulletinIDsToRacesJSON from "./data/bulletinServerData.json";

const commanderIDsToRaces: Record<string, string> = commanderIDsToRacesJSON;
const bulletinIDsToRaces: Record<string, Array<string>> = bulletinIDsToRacesJSON;

/**
 * Commander can be only for single race.
 * @param commanderId
 */
const getCommanderRace = (commanderId: number): string => {
  if (Object.prototype.hasOwnProperty.call(commanderIDsToRaces, commanderId)) {
    return commanderIDsToRaces[commanderId];
  } else {
    // We are logging this so we can catch this on the BE
    console.error(`Unknown commanderID ${commanderId}`);
    return "unknown";
  }
};

/**
 * Returns the array of possible races using this bulletin
 * @param bulletinID
 */
const getIntelBulletinRace = (bulletinID: number | string): Array<string> => {
  if (Object.prototype.hasOwnProperty.call(bulletinIDsToRaces, bulletinID)) {
    return bulletinIDsToRaces[bulletinID];
  } else {
    // We are logging this so we can catch this on the BE
    console.error(`Unknown intelBulletinID ${bulletinID}`);
    return [];
  }
};

const baseUrl = "https://coh2-api.reliclink.com";

const getLadderUrl = (leaderboardID: number, count = 40, start = 1): string => {
  // sortBy 1 means by ranking
  return encodeURI(
    baseUrl +
      `/community/leaderboard/getLeaderBoard2?leaderboard_id=${leaderboardID}&title=coh2&platform=PC_STEAM&sortBy=1&start=${start}&count=${count}`,
  );
};

const getRecentMatchHistoryUrl = (profileName: string): string => {
  return encodeURI(
    baseUrl +
      `/community/leaderboard/getRecentMatchHistory?title=coh2&profile_names=["${profileName}"]`,
  );
};

const getPlayerPersonalStatsUrl = (steamID: string): string => {
  return encodeURI(
    baseUrl +
      `/community/leaderboard/GetPersonalStat?title=coh2&profile_names=["/steam/${steamID}"]`,
  );
};

const getPlayerSearchUrl = (name: string): string => {
  return encodeURI(baseUrl + `/community/leaderboard/GetPersonalStat?title=coh2&search=${name}`);
};

/**
 * The names are important, can't be changed
 */
const leaderboardsID: Record<string, Record<string, number>> = {
  "1v1": {
    wehrmacht: 4,
    soviet: 5,
    wgerman: 6,
    usf: 7,
    british: 51,
  },
  "2v2": {
    wehrmacht: 8,
    soviet: 9,
    wgerman: 10,
    usf: 11,
    british: 52,
  },
  "3v3": {
    wehrmacht: 12,
    soviet: 13,
    wgerman: 14,
    usf: 15,
    british: 53,
  },
  "4v4": {
    wehrmacht: 16,
    soviet: 17,
    wgerman: 18,
    usf: 19,
    british: 54,
  },
  team2: {
    axis: 20,
    allies: 21,
  },
  team3: {
    axis: 22,
    allies: 23,
  },
  team4: {
    axis: 24,
    allies: 25,
  },
};

const raceIds: Record<number, string> = {
  0: "wermacht",
  1: "soviet",
  2: "wgerman",
  3: "usf",
  4: "british",
};

const raceIdsShortCuts: Record<number, string> = {
  0: "W",
  1: "S",
  2: "O", // west-german or oberkommando
  3: "U",
  4: "B",
};

const axisRaceIds = [0, 2];
const alliesRaceIds = [1, 3, 4];

const resultType = {
  lose: 0,
  win: 1,
};

const matchItemsLocation = {
  commanders: 3,
  intelBulletins: 4,
};

export {
  axisRaceIds,
  alliesRaceIds,
  raceIdsShortCuts,
  baseUrl,
  getLadderUrl,
  getPlayerPersonalStatsUrl,
  leaderboardsID,
  getRecentMatchHistoryUrl,
  raceIds,
  getCommanderRace,
  getIntelBulletinRace,
  resultType,
  matchItemsLocation,
  getPlayerSearchUrl,
};

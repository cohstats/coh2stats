import { unstable_cache } from "next/cache";
import type { ProcessedMatch, RelicLeaderboardResponse, LaddersDataObject } from "./types";
import {
  extractPlayerIDsInMatch,
  processSingleMatch,
  transformProfilesInMatch,
} from "./match-utils";
import { mapRelicResponseToLaddersData } from "./helpers";

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
  custom: {
    wehrmacht: 0,
    soviet: 1,
    wgerman: 2,
    usf: 3,
    british: 50,
  },
  AIEasyAxis: {
    "2v2": 26,
    "3v3": 34,
    "4v4": 42,
  },
  AIMediumAxis: {
    "2v2": 28,
    "3v3": 36,
    "4v4": 44,
  },
  AIHardAxis: {
    "2v2": 30,
    "3v3": 38,
    "4v4": 46,
  },
  AIExpertAxis: {
    "2v2": 32,
    "3v3": 40,
    "4v4": 48,
  },
  AIEasyAllies: {
    "2v2": 27,
    "3v3": 35,
    "4v4": 43,
  },
  AIMediumAllies: {
    "2v2": 29,
    "3v3": 37,
    "4v4": 45,
  },
  AIHardAllies: {
    "2v2": 31,
    "3v3": 39,
    "4v4": 47,
  },
  AIExpertAllies: {
    "2v2": 33,
    "3v3": 41,
    "4v4": 49,
  },
};

const levels: Record<string, string> = {
  "2": "6%",
  "3": "14%",
  "4": "20%",
  "5": "25%",
  "6": "35%",
  "7": "45%",
  "8": "55%",
  "9": "62%",
  "10": "69%",
  "11": "75%",
  "12": "80%",
  "13": "85%",
  "14": "90%",
  "15": "95%",
  "16": "rank 81-200",
  "17": "rank 37-80",
  "18": "rank 14-36",
  "19": "rank 3-13",
  "20": "rank 1-2",
};

/**
 * Base URL for Relic's COH2 API
 */
export const RELIC_API_BASE_URL = "https://coh2-api.reliclink.com";

/**
 * Builds the URL for fetching leaderboard data from Relic API
 * @param leaderboardID - The ID of the leaderboard (e.g., 4 for Wehrmacht 1v1)
 * @param count - Number of entries to fetch (default: 200)
 * @param start - Starting position for pagination (default: 1)
 * @returns Encoded URL string
 */
const buildLeaderboardUrl = (leaderboardID: number, count: number, start: number): string => {
  // sortBy=1 means sort by ranking
  return encodeURI(
    `${RELIC_API_BASE_URL}/community/leaderboard/getLeaderBoard2?leaderboard_id=${leaderboardID}&title=coh2&platform=PC_STEAM&sortBy=1&start=${start}&count=${count}`,
  );
};

/**
 * Fetches leaderboard data directly from Relic's COH2 API
 *
 * @param leaderboardID - The ID of the leaderboard to fetch (see leaderboardsID for valid IDs)
 * @param start - Starting position for pagination (default: 1)
 * @param count - Number of entries to fetch (default: 200)
 * @returns Promise resolving to Relic's leaderboard response
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * // Fetch Wehrmacht 1v1 leaderboard
 * const data = await fetchLeaderboardStats(4, 1, 200);
 *
 * // Fetch Soviet 2v2 leaderboard with pagination
 * const data = await fetchLeaderboardStats(9, 101, 100);
 * ```
 */
export const fetchLeaderboardStats = async (
  leaderboardID: number,
  start = 1,
  count = 200,
): Promise<RelicLeaderboardResponse> => {
  const url = buildLeaderboardUrl(leaderboardID, count, start);
  console.debug("[Relic API] Fetching leaderboard stats from", url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch leaderboard stats from Relic API. Status: ${
        response.status
      }, Response: ${await response.text()}`,
    );
  }

  return await response.json();
};

/**
 * Fetches player match stats from Relic API
 *
 * @param relicProfileID - The Relic profile ID of the player
 * @returns Promise resolving to match data including matchHistoryStats and profiles
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const data = await fetchPlayerMatchStats(12345);
 * ```
 */
const fetchPlayerMatchStats = async (relicProfileID: number): Promise<Record<string, any>> => {
  const url = buildRecentMatchHistoryUrl(relicProfileID);

  console.debug("[Relic API] Fetching player match stats from", url);
  const response = await fetch(url, {
    next: { revalidate: 90 }, // 90 seconds
  });

  if (response.status == 200) {
    const data = await response.json();

    if (data["result"]["message"] == "SUCCESS") {
      // Do we want to transform the data before we save them?
      delete data["result"]; // We don't need the result
      return data;
    } else if (data["result"]["message"] == "UNREGISTERED_PROFILE_NAME") {
      throw new Error(
        `Tried to get matches for non existing player id ${relicProfileID}. Response: UNREGISTERED_PROFILE_NAME`,
      );
    } else {
      throw new Error(`Failed to received the player stats. Response: ${JSON.stringify(data)}`);
    }
  } else {
    throw new Error(
      `Failed to fetch player match stats from Relic API. Status: ${
        response.status
      }, Response: ${await response.text()}`,
    );
  }
};

/**
 * Fetches and prepares matches for a player
 *
 * @param relicProfileID - The Relic profile ID of the player
 * @returns Promise resolving to an array of ProcessedMatch objects
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const matches = await getAndPrepareMatchesForPlayer(12345);
 * ```
 */
export const getAndPrepareMatchesForPlayer = async (
  relicProfileID: number,
): Promise<Array<ProcessedMatch>> => {
  const data = await fetchPlayerMatchStats(relicProfileID);

  const allMatches = data["matchHistoryStats"];
  const profiles = data["profiles"];

  // Transform the match objects, this removes unnecessary data, prepares additional information in single match object
  return allMatches.map((match: Record<string, any>) => prepareMatchDBObject(match, profiles));
};

/**
 * Builds the URL for fetching recent match history by profile ID from Relic API
 * @param relicProfileId - The Relic profile ID of the player
 * @returns Encoded URL string
 */
const buildRecentMatchHistoryUrl = (relicProfileId: number): string => {
  return encodeURI(
    `${RELIC_API_BASE_URL}/community/leaderboard/getRecentMatchHistoryByProfileId?title=coh2&profile_id=${relicProfileId}`,
  );
};

/**
 * This is the main function for processing and preparing the single match to be saved in the DB.
 *
 * @param singleMatchData - The match data object
 * @param profiles - Array of profile objects
 */
export const prepareMatchDBObject = (
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

/**
 * Internal function to fetch live leaderboard data with mapping
 * Uses the internal Relic API and maps to app format
 *
 * @param leaderboardID - The ID of the leaderboard to fetch
 * @param start - Starting position for pagination (default: 1)
 * @param count - Number of entries to fetch (default: 200)
 * @returns Promise resolving to leaderboard data in app format
 */
async function fetchLiveLeaderboardDataInternal(
  leaderboardID: number,
  start = 1,
  count = 200,
): Promise<LaddersDataObject> {
  console.log("[coh2-api] fetchLiveLeaderboardDataInternal called", {
    leaderboardID,
    start,
    count,
  });
  try {
    // Fetch data from Relic API with pagination parameters
    const relicResponse = await fetchLeaderboardStats(leaderboardID, start, count);

    // Map the response to our app's data format
    return mapRelicResponseToLaddersData(relicResponse);
  } catch (error) {
    console.error("Failed to fetch live leaderboard data:", error);
    throw new Error(
      `Failed to fetch leaderboard data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Fetch live leaderboard data with 30 second cache
 * Uses the internal Relic API and maps to app format
 *
 * @param leaderboardID - The ID of the leaderboard to fetch
 * @param start - Starting position for pagination (default: 1)
 * @param count - Number of entries to fetch (default: 200)
 * @returns Promise resolving to leaderboard data in app format
 *
 * @example
 * ```typescript
 * const data = await fetchLiveLeaderboardData(4, 1, 200); // Wehrmacht 1v1
 * const page2 = await fetchLiveLeaderboardData(4, 201, 200); // Next 200 entries
 * ```
 *
 * Note: This function is cached for 30 seconds. Each combination of leaderboardID, start, and count
 * is cached separately to support pagination.
 */
export const fetchLiveLeaderboardData = unstable_cache(
  async (leaderboardID: number, start = 1, count = 200) => {
    return fetchLiveLeaderboardDataInternal(leaderboardID, start, count);
  },
  ["live-leaderboard"],
  {
    revalidate: 30, // 30 seconds
    tags: ["live-leaderboard"],
  },
);

export { leaderboardsID, levels };

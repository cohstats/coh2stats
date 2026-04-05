import type { RelicLeaderboardResponse } from "./types";

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
const buildLeaderboardUrl = (
  leaderboardID: number,
  count: number,
  start: number
): string => {
  // sortBy=1 means sort by ranking
  return encodeURI(
    `${RELIC_API_BASE_URL}/community/leaderboard/getLeaderBoard2?leaderboard_id=${leaderboardID}&title=coh2&platform=PC_STEAM&sortBy=1&start=${start}&count=${count}`
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
  count = 200
): Promise<RelicLeaderboardResponse> => {
  const url = buildLeaderboardUrl(leaderboardID, count, start);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch leaderboard stats from Relic API. Status: ${response.status}, Response: ${await response.text()}`
    );
  }

  return await response.json();
};

export { leaderboardsID, levels };

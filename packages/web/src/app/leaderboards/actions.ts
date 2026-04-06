"use server";

import { unstable_cache } from "next/cache";
import { fetchLeaderboardStats } from "../../coh/coh2-api";
import { mapRelicResponseToLaddersData } from "../../coh/helpers";
import type { LaddersDataObject } from "../../coh/types";
import { getHistoricLeaderboardData } from "../../firebase/firebase-server";

/**
 * Internal function to fetch live leaderboard data
 * Uses the internal Relic API instead of the GCP function
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
 * Server action to fetch live leaderboard data with 30 second cache
 * Uses the internal Relic API instead of the GCP function
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

/**
 * Server action to fetch historic leaderboard data from Firestore
 *
 * @param timestamp - Unix timestamp for the leaderboard date (e.g., "1640995200")
 * @param type - Type of leaderboard (e.g., "1v1", "2v2", "3v3", "4v4", "team2", "team3", "team4")
 * @param race - Race/faction (e.g., "soviet", "wehrmacht", "wgerman", "usf", "british", "axis", "allies")
 * @returns Promise resolving to leaderboard data or undefined if not found
 *
 * @example
 * ```typescript
 * const data = await fetchHistoricLeaderboardData("1640995200", "1v1", "soviet");
 * const historicData = await fetchHistoricLeaderboardData("1640908800", "2v2", "wehrmacht");
 * ```
 */
export async function fetchHistoricLeaderboardData(
  timestamp: string,
  type: string,
  race: string,
): Promise<LaddersDataObject | undefined> {
  try {
    const data = await getHistoricLeaderboardData(timestamp, type, race);
    return data || undefined;
  } catch (error) {
    console.error("Failed to fetch historic leaderboard data:", error);
    return undefined;
  }
}

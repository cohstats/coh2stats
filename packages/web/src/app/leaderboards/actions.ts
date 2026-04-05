"use server";

import { fetchLeaderboardStats } from "../../coh/coh2-api";
import { mapRelicResponseToLaddersData } from "../../coh/helpers";
import type { LaddersDataObject } from "../../coh/types";

/**
 * Server action to fetch live leaderboard data
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
 */
export async function fetchLiveLeaderboardData(
  leaderboardID: number,
  start: number = 1,
  count: number = 200,
): Promise<LaddersDataObject> {
  try {
    // Fetch data from Relic API with pagination parameters
    const relicResponse = await fetchLeaderboardStats(leaderboardID, start, count);

    // Map the response to our app's data format
    const mappedData = mapRelicResponseToLaddersData(relicResponse);

    return mappedData;
  } catch (error) {
    console.error("Failed to fetch live leaderboard data:", error);
    throw new Error(
      `Failed to fetch leaderboard data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

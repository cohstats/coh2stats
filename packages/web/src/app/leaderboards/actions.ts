"use server";

import { fetchLeaderboardStats } from "../../coh/coh2-api";
import { mapRelicResponseToLaddersData } from "../../coh/helpers";
import type { LaddersDataObject } from "../../coh/types";

/**
 * Server action to fetch live leaderboard data
 * Uses the internal Relic API instead of the GCP function
 *
 * @param leaderboardID - The ID of the leaderboard to fetch
 * @returns Promise resolving to leaderboard data in app format
 *
 * @example
 * ```typescript
 * const data = await fetchLiveLeaderboardData(4); // Wehrmacht 1v1
 * ```
 */
export async function fetchLiveLeaderboardData(
  leaderboardID: number,
): Promise<LaddersDataObject> {
  try {
    // Fetch data from Relic API (start=1, count=200 are the defaults)
    const relicResponse = await fetchLeaderboardStats(leaderboardID, 1, 200);

    // Map the response to our app's data format
    const mappedData = mapRelicResponseToLaddersData(relicResponse);

    return mappedData;
  } catch (error) {
    console.error("Failed to fetch live leaderboard data:", error);
    throw new Error(
      `Failed to fetch leaderboard data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

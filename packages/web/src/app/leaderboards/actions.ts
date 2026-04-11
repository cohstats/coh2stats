"use server";

import { fetchLiveLeaderboardData } from "../../coh/coh2-api";
import type { LaddersDataObject } from "../../coh/types";
import { getHistoricLeaderboardData } from "../../firebase/firebase-server";

// Re-export fetchLiveLeaderboardData for backward compatibility
export { fetchLiveLeaderboardData };

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
  console.log("[Server Action] fetchHistoricLeaderboardData called", { timestamp, type, race });
  try {
    const data = await getHistoricLeaderboardData(timestamp, type, race);
    return data || undefined;
  } catch (error) {
    console.error("Failed to fetch historic leaderboard data:", error);
    return undefined;
  }
}

"use server";

import { getStatsData } from "@/firebase/firebase-server";

/**
 * Server action to fetch stats data
 * This is called from client components to fetch Firestore data
 * 
 * @param frequency - The time frequency (e.g., "daily", "week", "month")
 * @param timestamp - Unix timestamp for the stats date
 * @param statType - Type of stat document (e.g., "1v1-soviet", "4v4-wermacht")
 * @returns Promise<Record<string, any> | null> - The stats data or null if not found
 */
export async function fetchStatsData(
  frequency: string,
  timestamp: string,
  statType: string
): Promise<Record<string, any> | null> {
  return getStatsData(frequency, timestamp, statType);
}

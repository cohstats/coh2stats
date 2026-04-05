"use server";

import { getStatsData } from "@/firebase/firebase-server";

/**
 * Server action to fetch map stats data
 * This is called from client components to fetch Firestore data
 * 
 * @param frequency - The time frequency (e.g., "daily", "month")
 * @param timestamp - Unix timestamp for the stats date
 * @returns Promise<Record<string, any> | null> - The map stats data or null if not found
 */
export async function fetchMapStatsData(
  frequency: string,
  timestamp: string
): Promise<Record<string, any> | null> {
  return getStatsData(frequency, timestamp, "mapStats");
}

"use server";

import { getStatsData, getCustomAnalysis } from "@/firebase/firebase-server";

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
  timestamp: string,
): Promise<Record<string, any> | null> {
  console.log("[Server Action] fetchMapStatsData called", { frequency, timestamp });
  return getStatsData(frequency, timestamp, "mapStats");
}

/**
 * Server action to fetch custom map analysis data for a date range
 * This is called from client components to fetch custom map stats analysis
 *
 * @param startDate - Unix timestamp for the start date
 * @param endDate - Unix timestamp for the end date
 * @returns Promise<Record<string, any> | null> - The analysis data or null if not found
 */
export async function fetchCustomMapAnalysis(
  startDate: number,
  endDate: number,
): Promise<Record<string, any> | null> {
  console.log("[Server Action] fetchCustomMapAnalysis called", { startDate, endDate });
  return getCustomAnalysis(startDate, endDate, "map");
}

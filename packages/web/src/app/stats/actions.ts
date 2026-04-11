"use server";

import { getStatsData, getCustomAnalysis } from "@/firebase/firebase-server";

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
  statType: string,
): Promise<Record<string, any> | null> {
  console.log("[Server Action] fetchStatsData called", { frequency, timestamp, statType });
  return getStatsData(frequency, timestamp, statType);
}

/**
 * Server action to fetch custom analysis data for a date range
 * This is called from client components to fetch custom stats analysis
 *
 * @param startDate - Unix timestamp for the start date
 * @param endDate - Unix timestamp for the end date
 * @param type - Type of analysis: "normal" for regular stats, "top" for top 200 stats
 * @returns Promise<Record<string, any> | null> - The analysis data or null if not found
 */
export async function fetchCustomAnalysis(
  startDate: number,
  endDate: number,
  type: "normal" | "top",
): Promise<Record<string, any> | null> {
  console.log("[Server Action] fetchCustomAnalysis called", { startDate, endDate, type });
  return getCustomAnalysis(startDate, endDate, type);
}

"use server";

import { getPlayerStats } from "@/firebase/firebase-server";

/**
 * Server action to fetch player stats
 * This is called from client components to fetch Firestore data
 *
 * @returns Promise<Record<string, any> | null> - The player stats data or null if not found
 */
export async function fetchPlayerStats(): Promise<Record<string, any> | null> {
  console.log("[Server Action] fetchPlayerStats called");
  return getPlayerStats();
}

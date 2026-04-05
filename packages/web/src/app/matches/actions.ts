"use server";

import { getMatchData } from "@/firebase/firebase-server";

/**
 * Server action to fetch match data by ID
 * This is called from client components to fetch Firestore data
 * 
 * @param matchId - The match ID
 * @returns Promise<Record<string, any> | null> - The match data or null if not found
 */
export async function fetchMatchData(matchId: string): Promise<Record<string, any> | null> {
  return getMatchData(matchId);
}

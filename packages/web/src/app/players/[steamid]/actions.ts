"use server";

import { getPlayerCard, getPlayerMatches } from "@/coh/coh2stats-api";
import { PlayerCardAPIObject, PlayerMatchesResponse } from "@/coh/types";
import { getPlayerFirestoreMatches } from "@/firebase/firebase-server";

/**
 * Server action to fetch player card data
 * Wraps getPlayerCard() from @/coh/coh2stats-api
 *
 * @param steamid - The Steam ID of the player
 * @returns Promise<PlayerCardAPIObject | null> - Player card data or null on failure
 */
export async function fetchPlayerCardData(steamid: string): Promise<PlayerCardAPIObject | null> {
  try {
    return await getPlayerCard(steamid, false);
  } catch (error) {
    console.error("Failed to fetch player card data:", error);
    return null;
  }
}

/**
 * Server action to fetch player matches from Relic API
 * Wraps getPlayerMatches() from @/coh/coh2stats-api
 *
 * @param steamid - The Steam ID of the player
 * @returns Promise<PlayerMatchesResponse | null> - Player matches or null on failure
 */
export async function fetchPlayerMatchesData(
  steamid: string,
): Promise<PlayerMatchesResponse | null> {
  try {
    return await getPlayerMatches(steamid);
  } catch (error) {
    console.error("Failed to fetch player matches data:", error);
    return null;
  }
}

/**
 * Server action to fetch player matches from Firestore with cursor-based pagination
 *
 * @param params - Query parameters
 * @returns Promise with matches array and next cursor
 */
export async function fetchPlayerFirestoreMatches(params: {
  steamid: string;
  filterMatchType: number[] | null;
  perPage: number;
  cursorDocId?: string;
  cursorTimestamp?: number;
}): Promise<{
  matches: Array<Record<string, any>>;
  nextCursor: { docId: string; timestamp: number } | null;
}> {
  return getPlayerFirestoreMatches(params);
}

/**
 * Server action to fetch minimal player data for metadata/SEO
 * Used by generateMetadata() in layout.tsx
 *
 * @param steamid - The Steam ID of the player
 * @returns Promise<{ playerName: string } | null> - Player name or null on failure
 */
export async function fetchPlayerCardMetadata(
  steamid: string,
): Promise<{ playerName: string } | null> {
  try {
    const data = await getPlayerCard(steamid, false);
    const playerName = data?.steamProfile?.[steamid]?.name || null;

    if (playerName) {
      return { playerName };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch player card metadata:", error);
    return null;
  }
}

"use server";

import { unstable_cache } from "next/cache";
import { getAndPrepareMatchesForPlayer } from "@/coh/coh2-api";
import { PlayerMatchesResponse } from "@/coh/types";
import { getPlayerFirestoreMatches } from "@/firebase/firebase-server";

/**
 * Server action to fetch player matches from Relic API with 60 second cache
 * Wraps getAndPrepareMatchesForPlayer() from @/coh/coh2-api
 *
 * @param profileId - The Relic profile ID of the player
 * @returns Promise<PlayerMatchesResponse | null> - Player matches or null on failure
 */
export async function fetchPlayerMatchesData(
  profileId: number,
): Promise<PlayerMatchesResponse | null> {
  console.log("[Server Action] fetchPlayerMatchesData called", { profileId });
  const cachedFn = unstable_cache(
    async () => {
      try {
        const playerMatches = await getAndPrepareMatchesForPlayer(profileId);
        return { playerMatches };
      } catch (error) {
        console.error("Failed to fetch player matches data:", error);
        return null;
      }
    },
    [`player-matches-${profileId}`],
    {
      revalidate: 60, // 60 seconds
      tags: [`player-matches-${profileId}`],
    },
  );

  return cachedFn();
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
  console.log("[Server Action] fetchPlayerFirestoreMatches called", { steamid: params.steamid });
  return getPlayerFirestoreMatches(params);
}

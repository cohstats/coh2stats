/**
 * Centralized API Layer for COH2 Stats Backend
 *
 * This file contains all API calls to the COH2 Stats backend.
 * All functions return Promise<T> and throw errors for component-level handling.
 */

import config from "@/config";
import type {
  LaddersDataObject,
  LiveGame,
  PlayerCardAPIObject,
  PlayerMatchesResponse,
  SearchPlayersResponse,
} from "./types";

// Use config.apiUrl directly to avoid client/server boundary issues
const API_URL = config.apiUrl;

/**
 * Fetches leaderboard data for a specific leaderboard ID
 *
 * @param leaderBoardID - The ID of the leaderboard to fetch
 * @param start - The starting index for pagination (default: 0)
 * @returns Promise resolving to leaderboard data
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const data = await getLeaderboards(4, 0);
 * ```
 */
export async function getLeaderboards(
  leaderBoardID: number,
  start = 0,
): Promise<LaddersDataObject> {
  const response = await fetch(
    `${API_URL}getCOHLaddersHttpV2?leaderBoardID=${leaderBoardID}&start=${start}`,
    {},
  );

  if (!response.ok) {
    throw new Error(
      `API request failed with code: ${response.status}, res: ${await response.text()}`,
    );
  }

  return await response.json();
}

/**
 * Fetches player card data including stats, matches, and profile information
 *
 * @param steamid - The Steam ID of the player
 * @param includeMatches - Whether to include match history in the response
 * @returns Promise resolving to player card data
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const data = await getPlayerCard('/steam/76561198131099369', false);
 * ```
 */
export async function getPlayerCard(
  steamid: string,
  includeMatches: boolean,
): Promise<PlayerCardAPIObject> {
  const response = await fetch(
    `${API_URL}getPlayerCardEverythingHttp?steamid=${steamid}&includeMatches=${includeMatches}`,
    {
      headers: {
        Origin: "https://coh2stats.com",
      },
      next: { revalidate: 30 },
    },
  );

  if (!response.ok) {
    throw new Error(
      `API request failed with code: ${response.status}, res: ${await response.text()}`,
    );
  }

  return await response.json();
}

/**
 * Fetches player match history from Relic API
 *
 * @param steamid - The Steam ID of the player
 * @returns Promise resolving to player matches data
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const data = await getPlayerMatches('/steam/76561198131099369');
 * ```
 */
export async function getPlayerMatches(steamid: string): Promise<PlayerMatchesResponse> {
  const response = await fetch(`${API_URL}getPlayerMatchesRelicHttp?steamid=${steamid}`, {
    headers: {
      Origin: "https://coh2stats.com",
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed with code: ${response.status}, res: ${await response.text()}`,
    );
  }

  return await response.json();
}

/**
 * Searches for players by name
 *
 * @param name - The player name to search for
 * @returns Promise resolving to search results
 * @throws Error if the API request fails
 *
 * @example
 * ```typescript
 * const data = await searchPlayers('playerName');
 * ```
 */
export async function searchPlayers(name: string): Promise<SearchPlayersResponse> {
  const response = await fetch(`${API_URL}searchPlayers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { name } }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed with code: ${response.status}, res: ${await response.text()}`,
    );
  }

  return await response.json();
}

/**
 * Fetches live games from API
 *
 * @param playerGroup - "1" (1v1), "2" (2v2), "3" (3v3), "4" (4v4), "5" (vs AI), "0" (custom)
 * @param start - Pagination offset (0, 40, 80, etc.)
 * @param count - Number of games to fetch (default: 40)
 * @param sortOrder - "0" (Rank), "1" (Start Time), "2" (Viewers)
 * @returns Promise resolving to live games data, or null if the request fails
 *
 * @example
 * ```typescript
 * const games = await getLiveGames("1", "0", 40, "0");
 * ```
 *
 * Note: This function returns null on error instead of throwing.
 * The page-level revalidate (90 seconds) applies to this data.
 * This allows different cache times for Firestore (30 min) vs API (90 sec).
 */
export async function getLiveGames(
  playerGroup: string,
  start: string,
  count = 40,
  sortOrder: string,
): Promise<LiveGame[] | null> {
  try {
    const url = `${API_URL}getLiveGamesHttp?playerGroup=${playerGroup}&start=${start}&count=${count}&sortOrder=${sortOrder}&apiKey=c2sXe4zguRtYMBY`;

    console.log(
      `Fetching live games from API: playerGroup=${playerGroup}, start=${start}, sortOrder=${sortOrder}`,
    );

    const response = await fetch(url, {
      // No cache option here - we'll use Next.js revalidate at page level (90 seconds)
      headers: {
        Origin: "https://coh2stats.com",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data?.length || 0} live games from API`);
    return data as LiveGame[];
  } catch (error) {
    console.error("Failed to fetch live games from API:", error);
    return null;
  }
}

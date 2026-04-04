/**
 * Centralized API Layer for COH2 Stats Backend
 * 
 * This file contains all API calls to the COH2 Stats backend.
 * All functions return Promise<T> and throw errors for component-level handling.
 */

import { API_URL } from "../utils/helpers";
import type {
  LaddersDataObject,
  PlayerCardAPIObject,
  PlayerMatchesResponse,
  SearchPlayersResponse,
} from "./types";

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
  start: number = 0,
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
export async function getPlayerMatches(
  steamid: string,
): Promise<PlayerMatchesResponse> {
  const response = await fetch(
    `${API_URL}getPlayerMatchesRelicHttp?steamid=${steamid}`,
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

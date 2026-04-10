"use server";

import { searchPlayers } from "@/coh/coh2stats-api";
import { SearchPlayersResponse } from "@/coh/types";

/**
 * Server action to search for players
 * This proxies the searchPlayers API call through a server action
 *
 * @param searchParam - The search query string
 * @returns Promise<SearchPlayersResponse | null> - Search results or null on failure
 */
export async function searchPlayersAction(
  searchParam: string,
): Promise<SearchPlayersResponse | null> {
  console.log("[Server Action] searchPlayersAction called", { searchParam });
  try {
    return await searchPlayers(searchParam);
  } catch (error) {
    console.error("Failed to search for players:", error);
    return null;
  }
}

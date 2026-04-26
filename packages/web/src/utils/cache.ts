import { TTLCache } from "@isaacs/ttlcache";

/**
 * Domain-specific cache instances for different parts of the application.
 * Each cache has a maximum number of items and uses TTL (time-to-live) for automatic expiration.
 */

/**
 * Firestore cache instance
 * Handles: live games, historic leaderboard, stats data, player stats, match data
 * Max 400 items - handles 6 different cache types with moderate traffic
 */
export const firestoreCache = new TTLCache<string, any>({
  max: 400,
});

/**
 * API cache instance
 * Handles: player cards, player searches - high volume short-lived data
 * Max 600 items - higher capacity for frequently accessed data
 */
export const cohStatsApiCache = new TTLCache<string, any>({
  max: 600,
});

/**
 * Players cache instance
 * Handles: player matches - moderate volume
 * Max 300 items - adequate for player-specific data
 */
export const playersCache = new TTLCache<string, any>({
  max: 300,
});

/**
 * Stats cache instance
 * Handles: various stats queries, leaderboard data
 * Max 400 items - sufficient for stats-related queries
 */
export const RelicApiCache = new TTLCache<string, any>({
  max: 400,
});

/**
 * Generates a cache key from an object by converting it to JSON.
 * This ensures consistent cache keys for objects with the same properties.
 *
 * @param params - Object containing the parameters to create a cache key from
 * @returns A string cache key
 *
 * @example
 * getCacheKey({ steamid: "123", type: "player" })
 * // Returns: '{"steamid":"123","type":"player"}'
 */
export function getCacheKey(params: Record<string, any>): string {
  return JSON.stringify(params);
}

/**
 * Type definition for cache configuration
 */
export interface CacheConfig {
  /** Time-to-live in milliseconds */
  ttl: number;
}

/**
 * Helper function to fetch data with caching.
 * If the data is in the cache and not expired, return it.
 * Otherwise, fetch fresh data, cache it, and return it.
 *
 * @param cache - The TTLCache instance to use
 * @param key - The cache key
 * @param fetcher - Async function to fetch the data if not in cache
 * @param ttl - Time-to-live in milliseconds
 * @returns The cached or freshly fetched data
 */
export async function fetchWithCache<T>(
  cache: TTLCache<string, T>,
  key: string,
  fetcher: () => Promise<T>,
  ttl: number,
): Promise<T> {
  // Try to get from cache
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result
  cache.set(key, data, { ttl });

  return data;
}

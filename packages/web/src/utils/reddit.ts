export interface RedditPost {
  data: {
    title: string;
    ups: number;
    author: string;
    url_overridden_by_dest: string;
    created: number;
    permalink: string;
  };
}

interface CacheEntry {
  data: RedditPost[];
  timestamp: number;
  isUpdating: boolean;
}

// In-memory cache with 1-hour TTL (60 * 60 * 1000 ms)
const CACHE_TTL = 60 * 60 * 1000;
let cache: CacheEntry | null = null;

// Helper function to fetch fresh data from Reddit API
const fetchRedditPosts = async (): Promise<RedditPost[]> => {
  try {
    // "https://www.reddit.com/r/CompanyOfHeroes/top.json?limit=100&t=month"
    const res = await fetch("https://coh2stats.com/api/redditCF", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Failed to fetch Reddit posts:", res.status);
      return [];
    }

    const resData = await res.json();
    const requiredData = resData?.data?.children
      .filter((e: any) => `${e?.data?.link_flair_text}`.includes("CoH2"))
      .slice(0, 15);

    return requiredData || [];
  } catch (error) {
    console.error("Failed to fetch Reddit posts:", error);
    return [];
  }
};

// Main function with caching - only caches positive results, uses cache on failure
export async function getRedditPosts(): Promise<RedditPost[]> {
  console.log("[Reddit] Fetching Reddit posts");
  const now = Date.now();

  // If no cached data exists, fetch fresh data
  if (!cache) {
    const freshData = await fetchRedditPosts();
    // Only cache if we got valid data
    if (freshData.length > 0) {
      cache = {
        data: freshData,
        timestamp: now,
        isUpdating: false,
      };
      console.log(`[Reddit] Fetched fresh data: ${freshData.length} posts`);
    } else {
      console.warn(`[Reddit] Failed to fetch initial data, no cache available`);
    }
    return freshData;
  }

  const isExpired = now - cache.timestamp > CACHE_TTL;

  // If cache is still fresh, return cached data
  if (!isExpired) {
    console.log(
      `[Reddit] Returned cached data: ${cache.data.length} posts, cache timestamp: ${new Date(cache.timestamp).toISOString()}`,
    );
    return cache.data;
  }

  // Cache is expired - return stale data immediately and update in background
  if (!cache.isUpdating) {
    // Mark as updating to prevent multiple concurrent updates
    cache.isUpdating = true;

    // Update cache asynchronously in the background
    fetchRedditPosts()
      .then((freshData) => {
        // Only update cache if we got valid data, otherwise keep stale cache
        if (freshData.length > 0) {
          cache = {
            data: freshData,
            timestamp: Date.now(),
            isUpdating: false,
          };
          console.log(
            `[Reddit] Fetched fresh data: ${freshData.length} posts, cache timestamp: ${new Date(cache.timestamp).toISOString()}`,
          );
        } else {
          console.warn(
            `[Reddit] Failed to fetch fresh data (got 0 results), keeping stale cache with ${cache?.data.length} posts`,
          );
          // Reset updating flag so we can try again next time
          if (cache) {
            cache.isUpdating = false;
          }
        }
      })
      .catch((error) => {
        console.error(`[Reddit] Error fetching fresh data: ${error}`);
        // Reset updating flag on error so we can try again next time
        if (cache) {
          cache.isUpdating = false;
        }
      });
  }
  console.log(
    `[Reddit] Returned stale data: ${cache.data.length} posts, cache timestamp: ${new Date(cache.timestamp).toISOString()}`,
  );
  // Return stale data immediately
  return cache.data;
}

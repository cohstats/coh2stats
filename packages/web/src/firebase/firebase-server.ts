import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  startAfter,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import config from "../config";
import { StatsCurrentLiveGames, LaddersDataObject, PlayerStatsData } from "@/coh/types";
import { firestoreCache, getCacheKey, fetchWithCache } from "@/utils/cache";

// Initialize Firebase for server-side operations
// We use the client SDK as it works on both client and server in Next.js
let firebaseApp: any = undefined;

// In-memory cache for getTotalStoredMatches
let totalStoredMatchesCache: { value: string; timestamp: number } | null = null;
const TOTAL_STORED_MATCHES_CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

function initializeFirebaseServer() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const apps = getApps();
  if (apps.length > 0) {
    firebaseApp = apps[0];
    return firebaseApp;
  }

  try {
    const firebaseConfig = config.firebase();
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } catch (error) {
    console.error("[Firestore] Failed to initialize Firebase on server:", error);
    throw error;
  }
}

export async function getAnalyzedMatches(): Promise<string> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "global");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.analyzedMatches?.toLocaleString() || "12,106,009";
    }
    return "12,106,009";
  } catch (error) {
    console.error("[Firestore] Failed to get analyzed matches:", error);
    return "12,106,009";
  }
}

/**
 * Fetch live games Firestore data from stats/inGamePlayers
 * Returns current game counts and player counts by mode
 * @returns StatsCurrentLiveGames | null
 */
export async function getLiveGamesFirestoreData(): Promise<StatsCurrentLiveGames | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "inGamePlayers");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rawData = docSnap.data();

      // Convert Firestore Timestamp to plain number for serialization
      const data: StatsCurrentLiveGames = {
        games: rawData.games,
        players: rawData.players,
        totalPlayersAutomatch: rawData.totalPlayersAutomatch,
        totalPlayersIngame: rawData.totalPlayersIngame,
        // Convert Timestamp to milliseconds (number) if it exists
        timeStamp: rawData.timeStamp?.toMillis ? rawData.timeStamp.toMillis() : undefined,
      };

      console.log("[Firestore] Successfully fetched live games Firestore data");
      return data;
    }

    console.log("[Firestore] Live games Firestore document does not exist");
    return null;
  } catch (error) {
    console.error("[Firestore] Failed to get live games Firestore data:", error);
    return null;
  }
}

/**
 * Cached wrapper for getLiveGamesFirestoreData with 30 minute revalidation
 * This caches the Firestore data separately from the API data
 */
export async function getCachedLiveGamesFirestoreData(): Promise<StatsCurrentLiveGames | null> {
  const cacheKey = "live-games-firestore";
  const ttl = 30 * 60 * 1000; // 30 minutes in milliseconds

  return fetchWithCache(firestoreCache, cacheKey, () => getLiveGamesFirestoreData(), ttl);
}

/**
 * Fetch recent matches from Firestore
 * Returns the 20 most recent matches ordered by completion time
 * @returns Array<Record<string, any>> | null
 */
export async function getRecentMatches(): Promise<Array<Record<string, any>> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const matchesRef = collection(db, "matches");

    const q = query(matchesRef, orderBy("completiontime", "desc"), limit(20));

    console.log("[Firestore] Fetching recent matches from Firestore");

    const querySnapshot = await getDocs(q);

    const gamesData: Array<Record<string, any>> = [];
    querySnapshot.forEach((doc) => {
      gamesData.push(doc.data());
    });

    console.log(`[Firestore] Successfully fetched ${gamesData.length} recent matches`);
    return gamesData;
  } catch (error) {
    console.error("[Firestore] Failed to fetch recent matches:", error);
    return null;
  }
}

/**
 * Fetch total stored matches count from Firestore
 * Uses in-memory cache with 4-hour expiration
 * @returns string - formatted count or default value
 */
export async function getTotalStoredMatches(): Promise<string> {
  // Check if cache is valid
  const now = Date.now();
  if (
    totalStoredMatchesCache &&
    now - totalStoredMatchesCache.timestamp < TOTAL_STORED_MATCHES_CACHE_DURATION_MS
  ) {
    console.log("[Firestore] Returning cached total stored matches");
    return totalStoredMatchesCache.value;
  }

  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "totalStoredMatches");
    const docSnap = await getDoc(docRef);

    let result: string;
    if (docSnap.exists()) {
      const data = docSnap.data();
      result = data?.count?.toLocaleString() || "200,000";
    } else {
      result = "200,000";
    }

    // Update cache
    totalStoredMatchesCache = {
      value: result,
      timestamp: now,
    };

    return result;
  } catch (error) {
    console.error("[Firestore] Failed to get total stored matches:", error);
    // Return cached value if available, otherwise default
    return totalStoredMatchesCache?.value || "200,000";
  }
}

/**
 * Fetch historic leaderboard data from Firestore
 *
 * @param timestamp - Unix timestamp for the leaderboard date (e.g., "1640995200" or "now")
 * @param type - Type of leaderboard (e.g., "1v1", "2v2", "3v3", "4v4", "team2", "team3", "team4")
 * @param race - Race/faction (e.g., "soviet", "wehrmacht", "wgerman", "usf", "british", "axis", "allies")
 * @returns Promise<LaddersDataObject | null> - The leaderboard data or null if not found
 *
 * @example
 * ```typescript
 * const data = await getHistoricLeaderboardData("1640995200", "1v1", "soviet");
 * ```
 */
async function getHistoricLeaderboardDataInternal(
  timestamp: string,
  type: string,
  race: string,
): Promise<LaddersDataObject | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, `ladders/${timestamp}/${type}`, race);

    console.log(
      `[Firestore] Fetching historic leaderboard: ladders/${timestamp}/${type}/${race}`,
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(
        `[Firestore] Successfully fetched historic leaderboard data for ${race} ${type}`,
      );
      return docSnap.data() as LaddersDataObject;
    }

    console.log(
      `[Firestore] Historic leaderboard document does not exist: ladders/${timestamp}/${type}/${race}`,
    );
    return null;
  } catch (error) {
    console.error(
      `[Firestore] Failed to fetch historic leaderboard data for ${race} ${type}:`,
      error,
    );
    return null;
  }
}

/**
 * Cached wrapper for getHistoricLeaderboardData with 48-hour revalidation
 * Only caches successful results (non-null data)
 */
export async function getHistoricLeaderboardData(
  timestamp: string,
  type: string,
  race: string,
): Promise<LaddersDataObject | null> {
  const cacheKey = getCacheKey({ timestamp, type, race });
  const ttl = 172800 * 1000; // 48 hours in milliseconds

  // Try to get from cache first
  const cached = firestoreCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Fetch fresh data
  const result = await getHistoricLeaderboardDataInternal(timestamp, type, race);

  // Only cache successful results (non-null)
  if (result !== null) {
    firestoreCache.set(cacheKey, result, { ttl });
  }

  return result;
}

/**
 * Fetch stats data from Firestore for a given frequency, timestamp, and stat type
 *
 * @param frequency - The time frequency (e.g., "daily", "week", "month")
 * @param timestamp - Unix timestamp for the stats date
 * @param statType - Type of stat document (e.g., "1v1-soviet", "4v4-wermacht", "mapStats")
 * @returns Promise<Record<string, any> | null> - The stats data or null if not found
 *
 * @example
 * ```typescript
 * const data = await getStatsData("month", "1640995200", "1v1-soviet");
 * ```
 */
async function getStatsDataInternal(
  frequency: string,
  timestamp: string,
  statType: string,
): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, `stats/${frequency}/${timestamp}`, statType);

    console.log(`[Firestore] Fetching stats: stats/${frequency}/${timestamp}/${statType}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`[Firestore] Successfully fetched stats data for ${statType}`);
      return docSnap.data();
    }

    console.log(
      `[Firestore] Stats document does not exist: stats/${frequency}/${timestamp}/${statType}`,
    );
    return null;
  } catch (error) {
    console.error(`[Firestore] Failed to fetch stats data for ${statType}:`, error);
    return null;
  }
}

/**
 * Cached wrapper for getStatsData with 24-hour revalidation
 */
export async function getStatsData(
  frequency: string,
  timestamp: string,
  statType: string,
): Promise<Record<string, any> | null> {
  const cacheKey = getCacheKey({ frequency, timestamp, statType });
  const ttl = 86400 * 1000; // 24 hours in milliseconds

  return fetchWithCache(firestoreCache, cacheKey, () => getStatsDataInternal(frequency, timestamp, statType), ttl);
}

/**
 * Fetch player stats from Firestore
 * Returns player count statistics and country distribution
 * @returns Promise<PlayerStatsData | null>
 */
async function getPlayerStatsInternal(): Promise<PlayerStatsData | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "playerStats");

    console.log("[Firestore] Fetching player stats");

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[Firestore] Successfully fetched player stats");

      // Convert Firestore Timestamp to plain object for serialization
      return {
        count: data.count,
        last24hours: data.last24hours,
        last30days: data.last30days,
        last7days: data.last7days,
        countries: data.countries,
        // Convert Timestamp to milliseconds (number) if it exists
        timeStamp: data.timeStamp?.toMillis ? data.timeStamp.toMillis() : 0,
      };
    }

    console.log("[Firestore] Player stats document does not exist");
    return null;
  } catch (error) {
    console.error("[Firestore] Failed to fetch player stats:", error);
    return null;
  }
}

/**
 * Cached wrapper for getPlayerStats with 1-hour revalidation
 */
export async function getPlayerStats(): Promise<PlayerStatsData | null> {
  const cacheKey = "player-stats";
  const ttl = 3600 * 1000; // 1 hour in milliseconds

  return fetchWithCache(firestoreCache, cacheKey, () => getPlayerStatsInternal(), ttl);
}

/**
 * Internal function to fetch a single match from Firestore by match ID
 *
 * @param matchId - The match ID
 * @returns Promise<Record<string, any> | null> - The match data or null if not found
 */
async function getMatchDataInternal(matchId: string): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "matches", matchId);

    console.log(`[Firestore] Fetching match: ${matchId}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`[Firestore] Successfully fetched match data for ${matchId}`);
      return docSnap.data();
    }

    console.log(`[Firestore] Match document does not exist: ${matchId}`);
    return null;
  } catch (error) {
    console.error(`[Firestore] Failed to fetch match data for ${matchId}:`, error);
    return null;
  }
}

/**
 * Cached wrapper for getMatchData with 24-hour revalidation
 */
export async function getMatchData(matchId: string): Promise<Record<string, any> | null> {
  const cacheKey = getCacheKey({ matchId });
  const ttl = 86400 * 1000; // 24 hours in milliseconds

  return fetchWithCache(firestoreCache, cacheKey, () => getMatchDataInternal(matchId), ttl);
}

/**
 * Fetch player matches from Firestore with cursor-based pagination
 *
 * @param params - Query parameters
 * @returns Promise with matches array and next cursor
 */
export async function getPlayerFirestoreMatches(params: {
  steamid: string;
  filterMatchType: number[] | null;
  perPage: number;
  cursorDocId?: string;
  cursorTimestamp?: number;
}): Promise<{
  matches: Array<Record<string, any>>;
  nextCursor: { docId: string; timestamp: number } | null;
}> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const matchesRef = collection(db, "matches");

    // Build query based on filters
    let q;

    if (params.filterMatchType === null) {
      // No match type filter
      if (params.cursorDocId && params.cursorTimestamp !== undefined) {
        // With cursor - need to get the cursor document first
        const cursorDocRef = doc(db, "matches", params.cursorDocId);
        const cursorDocSnap = await getDoc(cursorDocRef);

        if (cursorDocSnap.exists()) {
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            startAfter(cursorDocSnap),
            limit(params.perPage),
          );
        } else {
          // Cursor document doesn't exist, fetch from beginning
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            limit(params.perPage),
          );
        }
      } else {
        // Initial query without cursor
        q = query(
          matchesRef,
          orderBy("startgametime", "desc"),
          where("steam_ids", "array-contains", params.steamid),
          limit(params.perPage),
        );
      }
    } else {
      // With match type filter
      if (params.cursorDocId && params.cursorTimestamp !== undefined) {
        // With cursor - need to get the cursor document first
        const cursorDocRef = doc(db, "matches", params.cursorDocId);
        const cursorDocSnap = await getDoc(cursorDocRef);

        if (cursorDocSnap.exists()) {
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            where("matchtype_id", "in", params.filterMatchType),
            startAfter(cursorDocSnap),
            limit(params.perPage),
          );
        } else {
          // Cursor document doesn't exist, fetch from beginning
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            where("matchtype_id", "in", params.filterMatchType),
            limit(params.perPage),
          );
        }
      } else {
        // Initial query without cursor
        q = query(
          matchesRef,
          orderBy("startgametime", "desc"),
          where("steam_ids", "array-contains", params.steamid),
          where("matchtype_id", "in", params.filterMatchType),
          limit(params.perPage),
        );
      }
    }

    const querySnapshot = await getDocs(q);

    // Extract matches data
    const matches: Array<Record<string, any>> = [];
    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });

    // Build next cursor from last document
    let nextCursor: { docId: string; timestamp: number } | null = null;
    if (querySnapshot.docs.length > 0) {
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      const lastDocData = lastDoc.data();

      // Only set cursor if we got a full page (meaning there might be more)
      if (querySnapshot.docs.length === params.perPage) {
        nextCursor = {
          docId: lastDoc.id,
          timestamp: lastDocData.startgametime,
        };
      }
    }

    return { matches, nextCursor };
  } catch (error) {
    console.error("[Firestore] Failed to fetch player Firestore matches:", error);
    return { matches: [], nextCursor: null };
  }
}

/**
 * Call the getCustomAnalysis Firebase Cloud Function
 * This function is used to generate custom stats analysis for date ranges
 *
 * @param startDate - Unix timestamp for the start date
 * @param endDate - Unix timestamp for the end date
 * @param type - Type of analysis: "normal", "top", or "map"
 * @returns Promise<Record<string, any> | null> - The analysis data or null if error
 */
export async function getCustomAnalysis(
  startDate: number,
  endDate: number,
  type: "normal" | "top" | "map",
): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const functions = getFunctions(app, config.firebaseFunctions.location);
    const customAnalysisFunction = httpsCallable(functions, "getCustomAnalysis");

    console.log(
      `[Firestore] Calling getCustomAnalysis: startDate=${startDate}, endDate=${endDate}, type=${type}`,
    );

    const result = await customAnalysisFunction({
      startDate,
      endDate,
      type,
    });

    console.log("[Firestore] Successfully called getCustomAnalysis");
    return result.data as Record<string, any>;
  } catch (error) {
    console.error("[Firestore] Failed to call getCustomAnalysis:", error);
    return null;
  }
}

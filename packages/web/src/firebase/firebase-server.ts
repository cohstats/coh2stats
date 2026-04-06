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
import { unstable_cache } from "next/cache";
import config from "../config";
import { StatsCurrentLiveGames, LaddersDataObject } from "@/coh/types";

// Initialize Firebase for server-side operations
// We use the client SDK as it works on both client and server in Next.js
let firebaseApp: any = undefined;

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
    console.error("Failed to initialize Firebase on server:", error);
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
    console.error("Failed to get analyzed matches:", error);
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

      console.log("Successfully fetched live games Firestore data");
      return data;
    }

    console.log("Live games Firestore document does not exist");
    return null;
  } catch (error) {
    console.error("Failed to get live games Firestore data:", error);
    return null;
  }
}

/**
 * Cached wrapper for getLiveGamesFirestoreData with 30 minute revalidation
 * This caches the Firestore data separately from the API data
 */
export const getCachedLiveGamesFirestoreData = unstable_cache(
  async () => getLiveGamesFirestoreData(),
  ['live-games-firestore'],
  {
    revalidate: 1800, // 30 minutes = 1800 seconds
    tags: ['live-games-firestore']
  }
);

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

    console.log("Fetching recent matches from Firestore");

    const querySnapshot = await getDocs(q);

    const gamesData: Array<Record<string, any>> = [];
    querySnapshot.forEach((doc) => {
      gamesData.push(doc.data());
    });

    console.log(`Successfully fetched ${gamesData.length} recent matches`);
    return gamesData;
  } catch (error) {
    console.error("Failed to fetch recent matches:", error);
    return null;
  }
}

/**
 * Fetch total stored matches count from Firestore
 * @returns string - formatted count or default value
 */
export async function getTotalStoredMatches(): Promise<string> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "totalStoredMatches");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.count?.toLocaleString() || "200,000";
    }
    return "200,000";
  } catch (error) {
    console.error("Failed to get total stored matches:", error);
    return "200,000";
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
  race: string
): Promise<LaddersDataObject | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, `ladders/${timestamp}/${type}`, race);

    console.log(`Fetching historic leaderboard: ladders/${timestamp}/${type}/${race}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Successfully fetched historic leaderboard data for ${race} ${type}`);
      return docSnap.data() as LaddersDataObject;
    }

    console.log(`Historic leaderboard document does not exist: ladders/${timestamp}/${type}/${race}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch historic leaderboard data for ${race} ${type}:`, error);
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
  race: string
): Promise<LaddersDataObject | null> {
  const cachedFn = unstable_cache(
    async () => getHistoricLeaderboardDataInternal(timestamp, type, race),
    [`historic-leaderboard-${timestamp}-${type}-${race}`],
    {
      revalidate: 172800, // 48 hours = 172800 seconds
      tags: [`historic-leaderboard-${timestamp}-${type}-${race}`]
    }
  );

  const result = await cachedFn();

  // Only return cached result if it's successful (non-null)
  // If null (document doesn't exist or error), bypass cache and try again
  if (result !== null) {
    return result;
  }

  // On null result, fetch without cache to get fresh error/missing status
  return getHistoricLeaderboardDataInternal(timestamp, type, race);
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
  statType: string
): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, `stats/${frequency}/${timestamp}`, statType);

    console.log(`Fetching stats: stats/${frequency}/${timestamp}/${statType}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Successfully fetched stats data for ${statType}`);
      return docSnap.data();
    }

    console.log(`Stats document does not exist: stats/${frequency}/${timestamp}/${statType}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch stats data for ${statType}:`, error);
    return null;
  }
}

/**
 * Cached wrapper for getStatsData with 24-hour revalidation
 */
export async function getStatsData(
  frequency: string,
  timestamp: string,
  statType: string
): Promise<Record<string, any> | null> {
  const cachedFn = unstable_cache(
    async () => getStatsDataInternal(frequency, timestamp, statType),
    [`stats-${frequency}-${timestamp}-${statType}`],
    {
      revalidate: 86400, // 24 hours = 86400 seconds
      tags: [`stats-${frequency}-${timestamp}-${statType}`]
    }
  );

  return cachedFn();
}

/**
 * Fetch player stats from Firestore
 * Returns player count statistics and country distribution
 * @returns Promise<Record<string, any> | null>
 */
async function getPlayerStatsInternal(): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "playerStats");

    console.log("Fetching player stats");

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Successfully fetched player stats");

      // Convert Firestore Timestamp to plain object for serialization
      return {
        count: data.count,
        last24hours: data.last24hours,
        last30days: data.last30days,
        last7days: data.last7days,
        countries: data.countries,
        // Convert Timestamp to milliseconds (number) if it exists
        timeStamp: data.timeStamp?.toMillis ? data.timeStamp.toMillis() : undefined,
      };
    }

    console.log("Player stats document does not exist");
    return null;
  } catch (error) {
    console.error("Failed to fetch player stats:", error);
    return null;
  }
}

/**
 * Cached wrapper for getPlayerStats with 1-hour revalidation
 */
export async function getPlayerStats(): Promise<Record<string, any> | null> {
  const cachedFn = unstable_cache(
    async () => getPlayerStatsInternal(),
    ['player-stats'],
    {
      revalidate: 3600, // 1 hour = 3600 seconds
      tags: ['player-stats']
    }
  );

  return cachedFn();
}

/**
 * Fetch a single match from Firestore by match ID
 *
 * @param matchId - The match ID
 * @returns Promise<Record<string, any> | null> - The match data or null if not found
 */
export async function getMatchData(matchId: string): Promise<Record<string, any> | null> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "matches", matchId);

    console.log(`Fetching match: ${matchId}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Successfully fetched match data for ${matchId}`);
      return docSnap.data();
    }

    console.log(`Match document does not exist: ${matchId}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch match data for ${matchId}:`, error);
    return null;
  }
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
            limit(params.perPage)
          );
        } else {
          // Cursor document doesn't exist, fetch from beginning
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            limit(params.perPage)
          );
        }
      } else {
        // Initial query without cursor
        q = query(
          matchesRef,
          orderBy("startgametime", "desc"),
          where("steam_ids", "array-contains", params.steamid),
          limit(params.perPage)
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
            limit(params.perPage)
          );
        } else {
          // Cursor document doesn't exist, fetch from beginning
          q = query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", params.steamid),
            where("matchtype_id", "in", params.filterMatchType),
            limit(params.perPage)
          );
        }
      } else {
        // Initial query without cursor
        q = query(
          matchesRef,
          orderBy("startgametime", "desc"),
          where("steam_ids", "array-contains", params.steamid),
          where("matchtype_id", "in", params.filterMatchType),
          limit(params.perPage)
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
    console.error("Failed to fetch player Firestore matches:", error);
    return { matches: [], nextCursor: null };
  }
}

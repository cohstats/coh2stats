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
} from "firebase/firestore";
import { unstable_cache } from "next/cache";
import config from "../config";
import { StatsCurrentLiveGames, LiveGame } from "@/coh/types";

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
 * Fetch live games from API
 * @param playerGroup - "1" (1v1), "2" (2v2), "3" (3v3), "4" (4v4), "5" (vs AI), "0" (custom)
 * @param start - Pagination offset (0, 40, 80, etc.)
 * @param count - Number of games to fetch (default: 40)
 * @param sortOrder - "0" (Rank), "1" (Start Time), "2" (Viewers)
 * @returns LiveGame[] | null
 *
 * Note: This function does NOT use unstable_cache.
 * The page-level revalidate (90 seconds) applies to this data.
 * This allows us to have different cache times for Firestore (30 min) vs API (90 sec).
 */
export async function getLiveGamesFromAPI(
  playerGroup: string,
  start: string,
  count: number = 40,
  sortOrder: string
): Promise<LiveGame[] | null> {
  try {
    const apiUrl = config.apiUrl;
    const url = `${apiUrl}getLiveGamesHttp?playerGroup=${playerGroup}&start=${start}&count=${count}&sortOrder=${sortOrder}&apiKey=c2sXe4zguRtYMBY`;

    console.log(`Fetching live games from API: playerGroup=${playerGroup}, start=${start}, sortOrder=${sortOrder}`);

    const response = await fetch(url, {
      // No cache option here - we'll use Next.js revalidate at page level (90 seconds)
      headers: {
        "Origin": "https://coh2stats.com",
      }
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

import LiveMatches from "./_components/live-matches";
import { getCachedLiveGamesFirestoreData, getLiveGamesFromAPI } from "@/firebase/firebase-server";

// Revalidate every 90 seconds for API data
// Note: Firestore data has its own cache (30 minutes) via unstable_cache
// This also sets Cache-Control headers for CDN caching:
// - Next.js automatically sets s-maxage to match revalidate value
// - CDN will cache the page for 90 seconds
// - stale-while-revalidate allows serving stale content while revalidating
export const revalidate = 90;

interface LiveMatchesPageProps {
  searchParams: Promise<{
    playerGroup?: string;
    orderBy?: string;
    start?: string;
  }>;
}

const LiveMatchesPage = async ({ searchParams }: LiveMatchesPageProps) => {
  // Await searchParams (Next.js 15 pattern)
  const params = await searchParams;

  // Extract URL params with defaults
  const playerGroup = params.playerGroup || "1";
  const orderBy = params.orderBy || "0";
  const start = params.start || "0";

  // Fetch data server-side
  // Firestore data cached for 30 minutes, API data cached for 90 seconds (page revalidate)
  const [firestoreData, liveGamesData] = await Promise.all([
    getCachedLiveGamesFirestoreData(),
    getLiveGamesFromAPI(playerGroup, start, 40, orderBy),
  ]);

  return (
    <LiveMatches
      key={`${playerGroup}-${orderBy}-${start}`}
      firestoreData={firestoreData}
      initialLiveGamesData={liveGamesData}
      playerGroup={playerGroup}
      orderBy={orderBy}
      start={start}
    />
  );
};

export default LiveMatchesPage;

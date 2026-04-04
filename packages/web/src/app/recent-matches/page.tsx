import RecentMatches from "./_components/recent-matches";
import { getRecentMatches, getTotalStoredMatches } from "@/firebase/firebase-server";

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

const RecentMatchesPage = async () => {
  // Fetch data server-side
  const [matchRecords, totalMatches] = await Promise.all([
    getRecentMatches(),
    getTotalStoredMatches(),
  ]);

  return (
    <RecentMatches
      initialMatchRecords={matchRecords || []}
      totalMatches={totalMatches}
    />
  );
};

export default RecentMatchesPage;

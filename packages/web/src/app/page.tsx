import React from "react";
import { getAnalyzedMatches, getHistoricLeaderboardData } from "@/firebase/firebase-server";
import { getRedditPosts } from "@/utils/reddit";
import { HomeContent } from "./_components/home-content";
import { fetchLeaderboardStats } from "@/coh/coh2-api";
import type { RelicLeaderboardResponse, LaddersDataObject } from "@/coh/types";

// Revalidate the page every hour (3600 seconds)
export const revalidate = 3600;

export default async function Home() {
  // Define leaderboard IDs for 1v1 mode
  const leaderboardIDs = {
    wehrmacht: 4,
    soviet: 5,
    wgerman: 6,
    usf: 7,
    british: 51,
  };

  const factions = ["wehrmacht", "soviet", "wgerman", "usf", "british"] as const;

  // Calculate yesterday's timestamp (server-side)
  const date = new Date();
  const yesterdayTimestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;

  // Fetch all data server-side in parallel
  const [analyzedMatches, redditPosts, ...leaderboardResults] = await Promise.all([
    getAnalyzedMatches(),
    getRedditPosts(),
    // Fetch current and historic data for all factions
    ...factions.flatMap((faction) => [
      fetchLeaderboardStats(leaderboardIDs[faction], 1, 10),
      getHistoricLeaderboardData(yesterdayTimestamp.toString(), "1v1", faction),
    ]),
  ]);

  // Organize leaderboard data by faction
  const leaderboardData: Record<
    string,
    {
      current: RelicLeaderboardResponse | null;
      historic: LaddersDataObject | null;
    }
  > = {};

  factions.forEach((faction, index) => {
    const currentIndex = index * 2;
    const historicIndex = index * 2 + 1;
    leaderboardData[faction] = {
      current: leaderboardResults[currentIndex] as RelicLeaderboardResponse,
      historic: leaderboardResults[historicIndex] as LaddersDataObject | null,
    };
  });

  return (
    <HomeContent
      analyzedMatches={analyzedMatches}
      redditPosts={redditPosts}
      leaderboardData={leaderboardData}
    />
  );
}

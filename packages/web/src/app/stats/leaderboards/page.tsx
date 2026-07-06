import { Metadata } from "next";
import { LeaderboardStatsContent } from "./_components/leaderboard-stats-content";
import { fetchLeaderboardStats } from "@/coh/coh2-api";
import { leaderboardsID } from "@/coh/types";

// Revalidate every 6 hours (21600 seconds)
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Leaderboard Stats",
  description: "View the number of players in each Company of Heroes 2 leaderboard",
  openGraph: {
    title: "COH2 Leaderboard Stats",
    description: "Player count statistics for all COH2 leaderboards",
    url: "https://coh2stats.com/stats/leaderboards",
  },
};

export interface LeaderboardPlayerCount {
  mode: string;
  faction: string;
  playerCount: number;
  leaderboardId: number;
}

export interface ModeMinMax {
  min: number;
  max: number;
}

export interface LeaderboardStatsData {
  leaderboardData: LeaderboardPlayerCount[];
  normalModeMinMax: Record<string, ModeMinMax>;
  teamModeMinMax: Record<string, ModeMinMax>;
}

export default async function LeaderboardStatsPage() {
  // Define all leaderboard modes and factions
  const leaderboardModes = ["1v1", "2v2", "3v3", "4v4", "team2", "team3", "team4"] as const;

  // Fetch all leaderboard data in parallel
  const fetchPromises: Promise<LeaderboardPlayerCount>[] = [];

  for (const mode of leaderboardModes) {
    const factions = Object.keys(leaderboardsID[mode]);
    for (const faction of factions) {
      const leaderboardId = leaderboardsID[mode][faction];
      fetchPromises.push(
        fetchLeaderboardStats(leaderboardId, 1, 1).then((response) => ({
          mode,
          faction,
          playerCount: response.leaderboardStats[0]?.ranktotal || 0,
          leaderboardId,
        }))
      );
    }
  }

  const leaderboardData = await Promise.all(fetchPromises);

  // Calculate min/max for normal modes (1v1, 2v2, 3v3, 4v4)
  const normalModes = ["1v1", "2v2", "3v3", "4v4"] as const;
  const normalModeMinMax: Record<string, ModeMinMax> = {};

  normalModes.forEach((mode) => {
    const counts = leaderboardData
      .filter((item) => item.mode === mode && item.playerCount > 0)
      .map((item) => item.playerCount);

    if (counts.length > 0) {
      normalModeMinMax[mode] = {
        min: Math.min(...counts),
        max: Math.max(...counts),
      };
    }
  });

  // Calculate min/max for team modes (team2, team3, team4 -> 2v2, 3v3, 4v4)
  const teamModes = [
    { mode: "team2", label: "2v2" },
    { mode: "team3", label: "3v3" },
    { mode: "team4", label: "4v4" },
  ] as const;
  const teamModeMinMax: Record<string, ModeMinMax> = {};

  teamModes.forEach(({ mode, label }) => {
    const counts = leaderboardData
      .filter((item) => item.mode === mode && item.playerCount > 0)
      .map((item) => item.playerCount);

    if (counts.length > 0) {
      teamModeMinMax[label] = {
        min: Math.min(...counts),
        max: Math.max(...counts),
      };
    }
  });

  return (
    <LeaderboardStatsContent
      leaderboardData={leaderboardData}
      normalModeMinMax={normalModeMinMax}
      teamModeMinMax={teamModeMinMax}
    />
  );
}

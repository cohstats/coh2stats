import { leaderboardsID, LeaderboardStat } from "../../coh/coh2-api";

/**
 * Finds the mode and race for a given leaderboard ID
 * @param id - The leaderboard ID to look up
 * @returns Object containing mode and race (undefined if not found)
 */
const findByLeaderBoardID = (
  id: number,
): { mode: undefined | string; race: undefined | string } => {
  for (const type in leaderboardsID) {
    for (const race in leaderboardsID[type]) {
      if (id === leaderboardsID[type][race]) {
        return {
          mode: type,
          race: race,
        };
      }
    }
  }

  return {
    mode: undefined,
    race: undefined,
  };
};

/**
 * Calculates overall statistics for a player card from leaderboard data
 * @param data - Array of leaderboard statistics
 * @returns Object containing overall player statistics
 */
const calculateOverallStatsForPlayerCard = (
  data: Array<LeaderboardStat>,
): Record<string, any> => {
  let totalGames = 0;
  let lastGameDate = 0;
  let totalWins = 0;
  let totalWinRate = null;

  let bestRank = {
    rank: Infinity,
    mode: "",
    race: "",
  };

  let mostPlayed = {
    games: 0,
    mode: "",
    race: "",
  };

  for (const stat of data) {
    if (stat.lastmatchdate > lastGameDate) {
      lastGameDate = stat.lastmatchdate;
    }

    const { mode, race } = findByLeaderBoardID(stat.leaderboard_id);

    if (mode?.startsWith("AI") || mode === "custom") {
      continue;
    }

    totalWins += stat.wins;
    totalGames += stat.wins + stat.losses;

    if (mode && race) {
      if (stat.rank < bestRank.rank && stat.rank > 0) {
        bestRank = {
          rank: stat.rank,
          mode,
          race,
        };
      }
      if (stat.wins + stat.losses > mostPlayed.games) {
        mostPlayed = {
          games: stat.wins + stat.losses,
          mode,
          race,
        };
      }
    }
  }

  totalWinRate = totalWins / totalGames;

  return {
    totalGames,
    lastGameDate,
    bestRank,
    mostPlayed,
    totalWinRate,
  };
};

export { findByLeaderBoardID, calculateOverallStatsForPlayerCard };

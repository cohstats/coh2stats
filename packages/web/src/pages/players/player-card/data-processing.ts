import { leaderboardsID } from "../../../coh/coh2-api";
import { LeaderBoardStats, validStatsTypes } from "../../../coh/types";
import { capitalize } from "../../../utils/helpers";

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

const prepareLeaderBoardDataForSinglePlayer = (
  data: Array<LeaderBoardStats>,
): Record<string, any> => {
  let finalStatsSingleGame: Record<string, any> = {};
  let finalStatsTeamGames: Record<string, any> = { axis: [], allies: [] };
  let finalStatsCustomGames: Array<Record<string, any>> = [];
  let finalStatsAIGame: Record<string, any> = {};

  for (const stat of data) {
    const { mode, race } = findByLeaderBoardID(stat.leaderboard_id);
    if (mode && race) {
      // These are non team games
      if (validStatsTypes.includes(mode)) {
        finalStatsSingleGame[race] = finalStatsSingleGame[race] ? finalStatsSingleGame[race] : [];
        finalStatsSingleGame[race].push({ ...stat, ...{ mode } });
      } else if (mode === "custom") {
        finalStatsCustomGames.push({ ...stat, ...{ mode: capitalize(race) } });
      } else if (["team2", "team3", "team4"].includes(mode)) {
        // team games
        finalStatsTeamGames[race].push({ ...stat, ...{ mode } });
      } else {
        // AI game
        finalStatsAIGame[mode] = finalStatsAIGame[mode] ? finalStatsAIGame[mode] : [];
        finalStatsAIGame[mode].push({ ...stat, ...{ mode: race } });
      }
    }
  }

  return {
    finalStatsSingleGame,
    finalStatsTeamGames,
    finalStatsCustomGames,
    finalStatsAIGame,
  };
};

const calculateOverallStatsForPlayerCard = (
  data: Array<LeaderBoardStats>,
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

export {
  findByLeaderBoardID,
  prepareLeaderBoardDataForSinglePlayer,
  calculateOverallStatsForPlayerCard,
};

import { timeAgo } from "../../../utils/helpers";
import {
  HistoricLeaderBoardStats,
  LaddersDataObject,
  PlayerCardDataArrayObject,
} from "../../../coh/types";

const convertTeamNames = (mode: string) => {
  if (mode.startsWith("team")) {
    return `Team of ${mode[4]}`;
  } else {
    return mode;
  }
};

const formatTimeAgo = (date: number) => {
  if (isNaN(date)) {
    return "";
  }

  return timeAgo.format(Date.now() - (Date.now() - date * 1000), "round-minute");
};

const latestDate = (sortedData: Array<PlayerCardDataArrayObject>) => {
  // Sometimes the lastmatchdate is missing from the relic database
  let latest = sortedData[0]?.lastmatchdate ? sortedData[0].lastmatchdate : 0;
  sortedData.forEach((data) => {
    if (data.lastmatchdate > latest) {
      latest = data.lastmatchdate;
    }
  });
  return latest;
};

const percentageFormat = (wins: number, losses: number) => {
  return Math.round(100 * Number(wins / (losses + wins)));
};

/**
 * Working with references.
 *
 * Warning: Mutating the data object.
 * @param data
 * @param historicLeaderboardStats
 */
const mergeLadderDataAndHistoricData = (
  data: LaddersDataObject,
  historicLeaderboardStats?: HistoricLeaderBoardStats | null,
) => {
  if (!historicLeaderboardStats) return;

  for (const stat of data.leaderboardStats) {
    const key = `${stat.statgroup_id}-${stat.leaderboard_id}`;
    if (historicLeaderboardStats.hasOwnProperty(key)) {
      stat.historic = historicLeaderboardStats[key];
    }
  }
};

export {
  convertTeamNames,
  formatTimeAgo,
  latestDate,
  percentageFormat,
  mergeLadderDataAndHistoricData,
};

import { ProcessedMatch } from "../types";

const calculateGameTime = (match: ProcessedMatch): number => {
  return match.completiontime - match.startgametime;
};

/**
 * WARNING: Mutates the stats object!
 * @param match
 * @param stats
 */
const addGameTimeAnalysisToStats = (match: ProcessedMatch, stats: Record<string, any>): void => {
  const currentMatchGameTime = calculateGameTime(match);

  stats["gameTime"] = stats["gameTime"] + currentMatchGameTime || currentMatchGameTime;

  if (!Object.prototype.hasOwnProperty.call(stats, "gameTimeSpread")) {
    stats["gameTimeSpread"] = {
      0: 0,
      5: 0,
      10: 0,
      20: 0,
      30: 0,
      40: 0,
      50: 0,
      60: 0,
    };
  }

  const currentMatchGameTimeInMinutes = currentMatchGameTime / 60;

  if (currentMatchGameTimeInMinutes > 60) {
    stats["gameTimeSpread"][60] = stats["gameTimeSpread"][60] + 1;
  } else if (currentMatchGameTimeInMinutes < 5) {
    stats["gameTimeSpread"][0] = stats["gameTimeSpread"][0] + 1;
  } else if (currentMatchGameTimeInMinutes < 10) {
    stats["gameTimeSpread"][5] = stats["gameTimeSpread"][5] + 1;
  } else {
    // This makes 33/10 -> 3 ; 3 * 10 ==> 30
    const key = ~~(currentMatchGameTimeInMinutes / 10) * 10;
    stats["gameTimeSpread"][key] = stats["gameTimeSpread"][key] + 1;
  }
};

export { calculateGameTime, addGameTimeAnalysisToStats };

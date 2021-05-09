import { PlayerReport, ProcessedMatch } from "../types";
import { alliesRaceIds, axisRaceIds, raceIdsShortCuts, resultType } from "../coh2-api";

const determineMatchWinner = (match: ProcessedMatch): "axis" | "allies" | "none" => {
  for (const playerReport of match.matchhistoryreportresults) {
    if (playerReport.resulttype === resultType.win) {
      if (axisRaceIds.includes(playerReport.race_id)) {
        // axis won
        return "axis";
      } else {
        // allies won
        return "allies";
      }
    }
  }

  // No-one won, this can happen in case that match was interrupted or something
  return "none";
};

const generateFactionString = (playerReports: Array<PlayerReport>) => {
  let factionShorts = [];

  for (const playerReport of playerReports) {
    factionShorts.push(raceIdsShortCuts[playerReport.race_id]);
  }

  factionShorts = factionShorts.sort();
  return factionShorts.join("");
};

/**
 * This should work like analyzeMatch function
 *
 *  FYI: This function doesn't do copy of the stats object - uses reference.
 *  Returning stats just to be clear!
 *
 * @param match
 * @param stats
 */
const addFactionMatrixAnalysisToStats = (match: ProcessedMatch, stats: Record<string, any>) => {
  const axisPlayerReports = match.matchhistoryreportresults.filter((playerReport) => {
    return axisRaceIds.includes(playerReport.race_id);
  });

  const alliesPlayerReports = match.matchhistoryreportresults.filter((playerReport) => {
    return alliesRaceIds.includes(playerReport.race_id);
  });

  const axisString = generateFactionString(axisPlayerReports);
  const alliesString = generateFactionString(alliesPlayerReports);

  const matchWinner = determineMatchWinner(match);

  // This is very important to state consistent, should probably extract somewhere
  const factionKey = `${axisString}x${alliesString}`;

  // Init the faction matrix
  if (!Object.prototype.hasOwnProperty.call(stats, "factionMatrix")) {
    stats["factionMatrix"] = {};
  }

  // init the specific faction key in case it not init
  if (!Object.prototype.hasOwnProperty.call(stats["factionMatrix"], factionKey)) {
    // This init is important because in some cases  there so little games that there might be just wins
    // or losses. Our system should deal with such thing just fine but should test it and .. ehm, this is easier ...
    stats["factionMatrix"][factionKey] = { wins: 0, losses: 0 };
  }

  if (matchWinner === "axis") {
    stats["factionMatrix"][factionKey]["wins"] =
      stats["factionMatrix"][factionKey]["wins"] + 1 || 1;
  } else if (matchWinner === "allies") {
    stats["factionMatrix"][factionKey]["losses"] =
      stats["factionMatrix"][factionKey]["losses"] + 1 || 1;
  }
  // When no-one won, we will not count this match

  return stats;
};

export { addFactionMatrixAnalysisToStats, generateFactionString, determineMatchWinner };

import { ProcessedMatch } from "../types";
import { filterOnlyAutomatchVsPlayers, sortMatchesByType } from "./match-analysis";
import { raceIds, resultType } from "../coh2-api";
import { addFactionMatrixAnalysisToStats } from "./composition";

const analyzeMapMatch = (match: ProcessedMatch, stats: Record<string, any>) => {
  stats["matchCount"] = stats["matchCount"] + 1 || 1;

  // Analysis for factions and win rates
  for (const playerReport of match.matchhistoryreportresults) {
    if (playerReport.resulttype == resultType.win) {
      const faction = raceIds[playerReport.race_id];
      stats[faction]["wins"] = stats[faction]["wins"] + 1 || 1;
    } else if (playerReport.resulttype == resultType.lose) {
      const faction = raceIds[playerReport.race_id];
      stats[faction]["losses"] = stats[faction]["losses"] + 1 || 1;
    }
  }

  return stats;
};

const createMapStats = (matches: Array<ProcessedMatch>) => {
  // FYI Stats is used as object reference in all of this code.
  // not really doing immutability
  let stats: Record<string, any> = {};

  // initialize the race name property
  for (const value of Object.values(raceIds)) {
    stats[value] = {};
  }

  for (const match of matches) {
    stats = analyzeMapMatch(match, stats);
    stats = addFactionMatrixAnalysisToStats(match, stats);
  }
  return stats;
};

const extractMapNames = (
  matches: Array<ProcessedMatch>,
): Record<string, Array<ProcessedMatch>> => {
  const splitByMaps: Record<string, Array<ProcessedMatch>> = {};

  for (const match of matches) {
    if (Object.prototype.hasOwnProperty.call(splitByMaps, match.mapname)) {
      splitByMaps[match.mapname].push(match);
    } else {
      splitByMaps[match.mapname] = [match];
    }
  }

  return splitByMaps;
};

const analyzeMatchesByMaps = (matches: Array<ProcessedMatch>): Record<string, any> => {
  matches = filterOnlyAutomatchVsPlayers(matches);
  const classifiedMatches = sortMatchesByType(matches);

  const fullStats: Record<string, Record<string, any>> = {};

  // This calculates single stats object for types like:
  // "1v1", "2v2", "3v3" etc
  for (const matchType in classifiedMatches) {
    const matchesInType = classifiedMatches[matchType];
    const splitByMaps = extractMapNames(matchesInType);

    fullStats[matchType] = {};

    for (const mapName in splitByMaps) {
      fullStats[matchType][mapName] = createMapStats(matchesInType);
    }
  }

  return fullStats;
};

export { analyzeMatchesByMaps };

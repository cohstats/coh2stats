import {
  getCommanderRace,
  getIntelBulletinRace,
  matchItemsLocation,
  raceIds,
  resultType,
} from "../coh2-api";
import { ProcessedMatch, steamIDsInLadderInterface } from "../types";
import { addFactionMatrixAnalysisToStats } from "./composition";
import { addGameTimeAnalysisToStats } from "./utils";

/**
 * FYI: This function doesn't do copy of the stats object - uses reference.
 * Returning stats just to be clear!
 *
 * @param match
 * @param stats
 */
const analyzeMatch = (match: ProcessedMatch, stats: Record<string, any>) => {
  stats["matchCount"] = stats["matchCount"] + 1 || 1;
  stats.maps[match.mapname] = stats.maps[match.mapname] + 1 || 1;

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

  // Analysis of commanders and intel bulletins
  for (const itemReport of match.matchhistoryitems) {
    if (itemReport.itemlocation_id == matchItemsLocation.commanders) {
      const raceName = getCommanderRace(itemReport["itemdefinition_id"]);

      stats["commanders"][raceName][itemReport["itemdefinition_id"]] =
        stats["commanders"][raceName][itemReport["itemdefinition_id"]] + 1 || 1;
    } else if (itemReport.itemlocation_id == matchItemsLocation.intelBulletins) {
      const itemServerID = itemReport["itemdefinition_id"];

      getIntelBulletinRace(itemServerID).forEach((raceName) => {
        stats["intelBulletins"][raceName][itemReport["itemdefinition_id"]] =
          stats["intelBulletins"][raceName][itemReport["itemdefinition_id"]] + 1 || 1;
      });
    }
  }

  addGameTimeAnalysisToStats(match, stats);

  return stats;
};

/**
 * We want to do analysis only on the matches are from automatch without AI
 * and games which ended with win or lose, other result types are ignored
 * @param matches
 */
const filterOnlyAutomatchVsPlayers = (matches: Array<ProcessedMatch>): Array<ProcessedMatch> => {
  // We could also filter based on the match_type ID but I am not sure
  // about that param

  return matches.filter((match: ProcessedMatch) => {
    // The result of the match must be win/lose
    const regularMatch = match.matchhistoryreportresults.every((playerReport) => {
      return (
        playerReport.resulttype == resultType.win || playerReport.resulttype == resultType.lose
      );
    });

    // Match type_id 5+ is automatch vs AI
    return match["description"] == "AUTOMATCH" && match["matchtype_id"] < 5 && regularMatch;
  });
};

const areMatchPlayersInLadder = (match: ProcessedMatch, ladder: Array<string>) => {
  for (const playerSteamID of match.steam_ids) {
    if (!ladder.includes(playerSteamID)) {
      return false;
    }
  }

  return true;
};

/**
 * Puts matches by amount of players category.
 * @param matches
 * @param ladderIDs
 */
const sortMatchesByType = (
  matches: Array<ProcessedMatch>,
  ladderIDs: steamIDsInLadderInterface | null = null,
): Record<string, Array<ProcessedMatch>> => {
  const matchesByMode = {
    "1v1": [] as Array<ProcessedMatch>,
    "2v2": [] as Array<ProcessedMatch>,
    "3v3": [] as Array<ProcessedMatch>,
    "4v4": [] as Array<ProcessedMatch>,
  };

  const decider = (match: ProcessedMatch, type: "1v1" | "2v2" | "3v3" | "4v4") => {
    // Ladders IDs are used for top 200 players analysis
    if (ladderIDs) {
      if (areMatchPlayersInLadder(match, ladderIDs[type])) {
        matchesByMode[type].push(match);
      }
    } else {
      matchesByMode[type].push(match);
    }
  };

  for (const match of matches) {
    switch (match.maxplayers) {
      case 2:
        decider(match, "1v1");
        break;
      case 4:
        decider(match, "2v2");
        break;
      case 6:
        decider(match, "3v3");
        break;
      case 8:
        decider(match, "4v4");
        break;
      default:
        console.error(
          `Found match with not implemented max players: ${match.maxplayers}, ${match}`,
        );
    }
  }

  return matchesByMode;
};

const createStats = (matches: Array<ProcessedMatch>) => {
  // FYI Stats is used as object reference in all of this code.
  // not really doing immutability
  let stats: Record<string, any> = {};
  // initialize the maps property
  stats["maps"] = {};
  stats["commanders"] = {
    wermacht: {},
    soviet: {},
    wgerman: {},
    usf: {},
    british: {},
    unknown: {},
  };
  stats["intelBulletins"] = {
    wermacht: {},
    soviet: {},
    wgerman: {},
    usf: {},
    british: {},
    unknown: {},
  };

  // initialize the race name property
  for (const value of Object.values(raceIds)) {
    stats[value] = {};
  }

  for (const match of matches) {
    stats = analyzeMatch(match, stats);
    stats = addFactionMatrixAnalysisToStats(match, stats);
  }
  return stats;
};

/**
 * In analyze matches we first sort/filter the matches in a way we want
 * and than we pass them to createStats function which prepares the
 * stats object for that particular stat type.
 *
 * @param matches
 */
const analyzeMatches = (matches: Array<ProcessedMatch>): Record<string, any> => {
  matches = filterOnlyAutomatchVsPlayers(matches);
  const classifiedMatches = sortMatchesByType(matches);

  const fullStats: Record<string, any> = {};

  // This calculates single stats object for types like:
  // "1v1", "2v2", "3v3" etc
  for (const matchType in classifiedMatches) {
    fullStats[matchType] = createStats(classifiedMatches[matchType]);
  }

  return fullStats;
};

const analyzeTopMatches = (
  matches: Array<ProcessedMatch>,
  ladderNameIDs: steamIDsInLadderInterface,
): Record<string, any> => {
  matches = filterOnlyAutomatchVsPlayers(matches);
  const classifiedMatches = sortMatchesByType(matches, ladderNameIDs);

  const fullStats: Record<string, any> = {};

  // This calculates single stats object for types like:
  // "1v1", "2v2", "3v3" etc
  for (const matchType in classifiedMatches) {
    fullStats[matchType] = createStats(classifiedMatches[matchType]);
  }

  return fullStats;
};

export { analyzeMatches, analyzeTopMatches, filterOnlyAutomatchVsPlayers, sortMatchesByType };

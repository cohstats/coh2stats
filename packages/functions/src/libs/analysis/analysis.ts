import { raceIds, resultType } from "../coh2-api";
import { ProcessedMatch } from "../types";

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

    for (const playerRepot of match.matchhistoryreportresults) {
        if (playerRepot.resulttype == resultType.win) {
            const faction = raceIds[playerRepot.race_id];
            stats[faction]["wins"] = stats[faction]["wins"] + 1 || 1;
        } else {
            const faction = raceIds[playerRepot.race_id];
            stats[faction]["losses"] = stats[faction]["losses"] + 1 || 1;
        }
    }

    return stats;
};

/**
 * We want to do analysis only on the matches
 * which are from automatch
 * @param matches
 */
const filterOnlyAutomatch = (matches: Array<ProcessedMatch>) => {
    // We could also filter based on the match_type ID but I am not sure
    // about that param

    return matches.filter((match: ProcessedMatch) => {
        return match["description"] == "AUTOMATCH";
    });
};

/**
 * Puts matches by amount of players category.
 * @param matches
 */
const sortMatchesByType = (
    matches: Array<ProcessedMatch>,
): Record<string, Array<ProcessedMatch>> => {
    const matchesByMode = {
        "1v1": [] as Array<ProcessedMatch>,
        "2v2": [] as Array<ProcessedMatch>,
        "3v3": [] as Array<ProcessedMatch>,
        "4v4": [] as Array<ProcessedMatch>,
    };

    for (const match of matches) {
        switch (match.maxplayers) {
            case 2:
                matchesByMode["1v1"].push(match);
                break;
            case 4:
                matchesByMode["2v2"].push(match);
                break;
            case 6:
                matchesByMode["3v3"].push(match);
                break;
            case 8:
                matchesByMode["4v4"].push(match);
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

    // initialize the race name property
    for (const value of Object.values(raceIds)) {
        stats[value] = {};
    }

    for (const match of matches) {
        stats = analyzeMatch(match, stats);
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
    matches = filterOnlyAutomatch(matches);
    const classifiedMatches = sortMatchesByType(matches);

    const fullStats: Record<string, any> = {};

    // This calculates single stats object for types like:
    // "1v1", "2v2", "3v3" etc
    for (const matchType in classifiedMatches) {
        fullStats[matchType] = createStats(classifiedMatches[matchType]);
    }

    return fullStats;
};

export { analyzeMatches };

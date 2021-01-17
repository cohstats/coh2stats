/**
 * FYI: This function doesn't do copy of the stats object - uses reference.
 * Returning stats just to be clear!
 *
 * @param match
 * @param stats
 */
const analyzeMatch = (match: ProcessedMatch, stats: Record<string, any>) => {

    stats.maps[match.mapname] = stats.maps[match.mapname] + 1 || 0;


    return stats;
}


/**
 * We want to do analysis only on the matches
 * which are from automatch
 * @param matches
 */
const filterOnlyAutomatch = (matches: Array<ProcessedMatch>) =>{
    // We could also filter based on the match_type ID but I am not sure
    // about that param

    return matches.filter((match: ProcessedMatch) => {
        return match["description"] == "AUTOMATCH";
    })
}

/**
 * Puts matches by amount of players category.
 * @param matches
 */
const sortMatchesByType = (matches: Array<ProcessedMatch>): Record<string, any> => {
    let matchesByMode = {
        "1v1": <Array<ProcessedMatch>> [],
        "2v2": <Array<ProcessedMatch>> [],
        "3v3": <Array<ProcessedMatch>> [],
        "4v4": <Array<ProcessedMatch>> [],
    }

    for(let match of matches){
        switch(match.maxplayers) {
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
                break
            default:
                console.error(`Found match with not implemented max players: ${match.maxplayers}, ${match}`);
        }
    }

    return matchesByMode;
}

const analyzeMatches = (matches: Array<ProcessedMatch>) => {
    matches = filterOnlyAutomatch(matches);
    const classifiedMatches = sortMatchesByType(matches);

    // This calculates single stats object for types like:
    // "1v1", "2v2", "3v3" etc
    for(let matchType in classifiedMatches){


        // FYI Stats is used as object reference in all of this code
        // I don't see a reason to do immutability here;
        let stats: Record<string, any> = {};
        // initialize the maps property
        stats["maps"] = {};

        for(let match of classifiedMatches[matchType]){
            stats = analyzeMatch(match, stats)
        }

        console.log(stats);

    }



}

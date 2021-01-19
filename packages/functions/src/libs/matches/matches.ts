import axios from "axios";
import { getRecentMatchHistoryUrl } from "../coh2-api";
import { prepareMatchDBObject, isLastDayMatch } from "./single-match";

import { performance } from "perf_hooks";
import { ProcessedMatch } from "../types";

const fetchPlayerMatchStats = async (profileName: string): Promise<Record<string, any>> => {
    const url = getRecentMatchHistoryUrl(profileName);

    const response = await axios.get(url);

    if (response.status == 200 && response.data["result"]["message"] == "SUCCESS") {
        const data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data;
    } else {
        throw Object.assign(new Error("Failed to received the player stats stats"), { response });
    }
};

const getAndPrepareMatchesForPlayer = async (
    profileName: string,
): Promise<Array<ProcessedMatch>> => {
    // Monitoring fetching time - the response from the relic server
    const t0 = performance.now();
    const data = await fetchPlayerMatchStats(profileName);
    const t1 = performance.now();

    const allMatches = data["matchHistoryStats"];
    const profiles = data["profiles"];

    // Now filter out the old matches, we need to keep the daily writes to the DB low
    let matches = allMatches.filter((match: Record<string, any>) => isLastDayMatch(match));
    console.log(
        `Player ${profileName} fetched ${allMatches.length} matches in ${
            (t1 - t0) | 0
        } ms. From which ${matches.length} happened in the last 25 hours`,
    );

    // Transform the match objects, this removes unnecessary data, preparers additional information in single match object
    matches = matches.map((match: Record<string, any>) => prepareMatchDBObject(match, profiles));

    return matches;
};

export { getAndPrepareMatchesForPlayer };

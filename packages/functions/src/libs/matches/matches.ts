import axios from "axios";
import {getRecentMatchHistoryUrl} from "../coh2-api";
import {prepareMatchDBObject, isLastDayMatch} from "./single-match";

const fetchPlayerMatchStats = async (profileName: string): Promise<Record<string, any>> => {
    const url = getRecentMatchHistoryUrl(profileName);
    console.log(url)

    const response = await axios.get(url);

    if (response.status == 200 && response.data["result"]["message"] == "SUCCESS") {
        let data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data;
    } else {
        throw `Failed to received the player stats stats, response: ${response} `
    }
}

const getAndPrepareMatches = async (profileName: string): Promise<Array<Record<string, any>>> => {
    const data = await fetchPlayerMatchStats(profileName);

    const allMatches = data["matchHistoryStats"];
    const profiles = data["profiles"];

    // Now filter out the old matches, we need to keep the daily writes to the DB low
    let matches = allMatches.filter((match: Record<string, any>) => isLastDayMatch(match))
    console.log(`Player ${profileName} fetched ${allMatches.length} matches. From which ${matches.length} happened in the last 25 hours`);

    // Transform the match objects, this removes unnecessary data, preparers additional information in single match object
    matches = matches.map((match: Record<string, any>) => prepareMatchDBObject(match, profiles))

    return matches;
}

export {
    getAndPrepareMatches
}
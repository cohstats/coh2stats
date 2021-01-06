import axios from "axios";
import {getRecentMatchHistoryUrl} from "../coh2-api";

const fetchPlayerMatchStats = async (profileName: string): Promise<Record<string, any>> => {
    const response = await axios.get(getRecentMatchHistoryUrl(profileName));

    if (response.status == 200 && response.data["result"]["message"] == "SUCCESS") {
        let data = response.data;
        // Do we want to transform the data before we save them?
        delete data["result"]; // We don't need the result

        return data;
    } else {
        throw `Failed to received the ladder stats, response: ${response} `
    }
}

/**
 * We want to filter out items we don't need to store.
 *  "itemlocation_id":3 = commander
 *  "itemlocation_id":4 = intel bulletin
 *
 * @param singleMatchData
 */
const filterOutItems = (singleMatchData: Record<string, any>) => {
    singleMatchData["matchhistoryitems"] = singleMatchData["matchhistoryitems"].filter((item: Record<string, any>) => {
        return item["itemlocation_id"] == 3 || item["itemlocation_id"] == 4;
    });
    return singleMatchData;
}

/**
 * Removes unnecessary items from the items info.
 *
 * @param singleMatchData
 */
const removeExtraDataFromItems = (singleMatchData: Record<string, any>) => {
    for(const item of singleMatchData["matchhistoryitems"]){
        delete item["durabilitytype"];
        delete item["durability"];
        delete item["metadata"];
        delete item["matchhistory_id"]; // We don't need because the object is nested under the match itself
    }

    return singleMatchData;
}


const processSingleMatch = (singleMatchData: Record<string, any>) => {
    // delete fields we don't need to track
    delete singleMatchData["options"]; // Don't know what this field does
    delete singleMatchData["slotinfo"]; // Don't know what this field does
    delete singleMatchData["observertotal"]; // We don't care about this
    delete singleMatchData["matchurls"]; // Don't know, don't care

    singleMatchData = filterOutItems(singleMatchData)
    singleMatchData = removeExtraDataFromItems(singleMatchData)

    return singleMatchData;
}




// const processMatches = async (profileName: string) => {
//     const data = await fetchPlayerMatchStats(profileName);
//
//
//     return true;
// }

export {
    filterOutItems,
    fetchPlayerMatchStats,
    removeExtraDataFromItems,
    processSingleMatch
}
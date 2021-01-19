/**
 * Returns timestamp for current DATE(without time) in UTC
 */
const getCurrentDateTimestamp = (): number => {
    const date = new Date();
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
}

const getYesterdayDateTimestamp = (): number => {
    const date = new Date();
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;
}

/**
 * Returns the history timestamp. This function can be used
 * for filtering games in the last day for example.
 * @param hours How many hours in history we want to go.
 */
const getHoursOldTimestamp = (hours = 25): number => {
    return (Date.now()/1000) - (hours *60*60);
}

/**
 * Extracts just the string ID from the steam name used in the results of API.
 * @param name In format "/steam/76561198131099369"
 */
const convertSteamNameToID = (name: string): string => {
    const res = name.match(/\/steam\/(\d+)/);
    if(res) return res[1];
    return "";
}

export {
    convertSteamNameToID,
    getCurrentDateTimestamp,
    getHoursOldTimestamp,
    getYesterdayDateTimestamp
}

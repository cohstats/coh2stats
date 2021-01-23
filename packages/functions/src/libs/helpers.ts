/**
 * Returns timestamp for current DATE(without time) in UTC
 */
const getCurrentDateTimestamp = (): number => {
    const date = new Date();
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
};

const getYesterdayDateTimestamp = (): number => {
    const date = new Date();
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;
};

/**
 * Returns the history timestamp. This function can be used
 * for filtering games in the last day for example.
 * @param hours How many hours in history we want to go.
 */
const getHoursOldTimestamp = (hours = 25): number => {
    return Date.now() / 1000 - hours * 60 * 60;
};

/**
 * Extracts just the string ID from the steam name used in the results of API.
 * @param name In format "/steam/76561198131099369"
 */
const convertSteamNameToID = (name: string): string => {
    const res = name.match(/\/steam\/(\d+)/);
    if (res) return res[1];
    return "";
};

/**
 * Takes 2 objects.
 * This function is not immutable! Modifies the first object.
 *
 * Maybe better name?
 * @param masterObject
 * @param newObject
 */
const sumValuesOfObjects = (
    masterObject: Record<string, Record<string, any> | number>,
    newObject: Record<string, Record<string, any> | number>,
): Record<string, any> => {
    for (const key in newObject) {
        if (Object.prototype.hasOwnProperty.call(masterObject, key)) {
            if (masterObject[key] instanceof Object) {
                // @ts-ignore
                masterObject[key] = sumValuesOfObjects(masterObject[key], newObject[key]);
            } else {
                // @ts-ignore
                masterObject[key] = masterObject[key] + newObject[key];
            }
        } else {
            masterObject[key] = newObject[key];
        }
    }

    return masterObject;
};

export {
    convertSteamNameToID,
    getCurrentDateTimestamp,
    getHoursOldTimestamp,
    getYesterdayDateTimestamp,
    sumValuesOfObjects,
};

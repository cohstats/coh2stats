/**
 * Returns timestamp for current DATE(without time) in UTC
 */
const getCurrentDateTimestamp = (): number => {
    const date = new Date();
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
}


/**
 * Returns the history timestamp. This function can be used
 * for filtering games in the last day for example.
 * @param hours How many hours in history we want to go.
 */
const getHoursOldTimestamp = (hours: number = 25): number => {
    return (Date.now()/1000) - (hours *60*60);
}

export {
    getCurrentDateTimestamp,
    getHoursOldTimestamp
}
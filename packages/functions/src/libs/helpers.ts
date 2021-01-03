
/**
 * Returns timestamp for current DATE in UTC
 */
const getCurrentDateTimestamp = () =>{
    const date = new Date();
    return  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /  1000;
}

export {
    getCurrentDateTimestamp
}
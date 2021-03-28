import { StatDict } from "./types";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

process.env.TZ = "utc";

/**
 * Returns timestamp for current DATE(without time) in UTC
 * Date-fns includes the time - so we don't want to use it in this case
 */
const getCurrentDateTimestamp = (date = new Date()): number => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
};

const getYesterdayDateTimestamp = (): number => {
  const date = new Date();
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;
};

const getYesterdayDateTimeStampInterval = (): Record<string, number> => {
  const date = new Date();
  return getDateTimeStampInterval(date.getUTCDate() - 1);
};

const getDateTimeStampInterval = (day: number): Record<string, number> => {
  const date = new Date();
  // Do not add ms to avoid floating point!
  const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day, 0, 0, 0) / 1000;
  const end = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day, 23, 59, 59) / 1000;

  return {
    start,
    end,
  };
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
 * Maybe I should have imported some lib for datetime :Facepalm:
 * @param timestamp
 */
const printUTCTime = (timestamp: number): string => {
  return `${new Date(timestamp * 1000)}`;
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
 * WARNING: This functions works only on Monday! :D
 * Expects UTC timezone! The cloud functions are set to run in UTC! But
 * it could be used elsewhere so count with this.
 */
const getLastWeekTimeStamps = (): Array<number> => {
  // WARNING: This shit doesn't work on Windows
  // https://github.com/nodejs/node/issues/4230
  // set utc just to be SURE startOfWeek works correctly
  process.env.TZ = "utc";

  const yesterday = getYesterdayDateTimestamp() * 1000;
  return getWeekTimeStamps(yesterday);
};

/**
 * WARNING: This functions works only on Monday! :D
 * Expects UTC timezone! The cloud functions are set to run in UTC! But
 * it could be used elsewhere so count with this.
 */
const getWeekTimeStamps = (date: Date | number): Array<number> => {
  return getDateTimeStampsInRange(
    startOfWeek(date, { weekStartsOn: 1 }),
    endOfWeek(date, { weekStartsOn: 1 }),
  );
};

const getStartOfTheWeek = (date: Date | number): Date => {
  process.env.TZ = "utc";
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 *
 * @param startDate
 * @param endDate
 */
const getDateTimeStampsInRange = (
  startDate: Date | number,
  endDate: Date | number,
): Array<number> => {
  return getDatesInRange(startDate, endDate).map((date) => getCurrentDateTimestamp(date));
};

const getDatesInRange = (startDate: Date | number, endDate: Date | number): Array<Date> => {
  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
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
  masterObject: StatDict | Record<string, any>,
  newObject: StatDict,
): StatDict => {
  for (const key in newObject) {
    // Also in master object => merge
    if (key in masterObject) {
      const masterValue = masterObject[key];
      const newValue = newObject[key];
      // Both are numbers
      if (typeof masterValue === "number" && typeof newValue === "number") {
        masterObject[key] = masterValue + newValue;
        // Both are Objects
      } else if (typeof masterValue !== "number" && typeof newValue !== "number") {
        masterObject[key] = sumValuesOfObjects(masterValue, newValue);
        // Something is wrong
      } else {
        console.error("Mismatched types in summing the stats!", newObject);
      }
      // Not in master object => put new
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
  getYesterdayDateTimeStampInterval,
  printUTCTime,
  getDateTimeStampsInRange,
  getLastWeekTimeStamps,
  getWeekTimeStamps,
  getStartOfTheWeek,
};

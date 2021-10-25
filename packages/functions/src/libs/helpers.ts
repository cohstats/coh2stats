import { StatDict } from "./types";
import { eachDayOfInterval, endOfWeek, startOfWeek, startOfMonth, endOfMonth } from "date-fns";

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

const getDateTimeStampInterval = (day: number, date = new Date()): Record<string, number> => {
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
 * @param timestampOrDate
 */
const printUTCTime = (timestampOrDate: number | Date): string => {
  if (typeof timestampOrDate === "number") {
    return `${new Date(timestampOrDate * 1000)}`;
  } else {
    return `${timestampOrDate}`;
  }
};

/**
 * Extracts just the string ID from the steam name used in the results of API.
 * Some could be https://coh2-api.reliclink.com/community/leaderboard/GetPersonalStat?title=coh2&search=rak
 * Some could be "/feral/97200"
 *
 * @param name In format "/steam/76561198131099369"
 */
const convertSteamNameToID = (name: string): string => {
  const res = name.match(/\/steam\/(\d+)/);
  if (res) return res[1];
  const feral = name.match(/\/feral\/(\d+)/);
  if (feral) return feral[1];
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
 * Expects UTC timezone! The cloud functions are set to run in UTC! But
 * it could be used elsewhere so count with this.
 */
const getWeekTimeStamps = (date: Date | number): Array<number> => {
  return getDateTimeStampsInRange(
    startOfWeek(date, { weekStartsOn: 1 }),
    endOfWeek(date, { weekStartsOn: 1 }),
  );
};

const getMonthTimeStamps = (date: Date | number): Array<number> => {
  return getDateTimeStampsInRange(startOfMonth(date), endOfMonth(date));
};

const getStartOfTheMonth = (date: Date | number): Date => {
  process.env.TZ = "utc";
  return startOfMonth(date);
};

const getStartOfTheWeek = (date: Date | number): Date => {
  process.env.TZ = "utc";
  return startOfWeek(date, { weekStartsOn: 1 });
};

const convertDateToDayTimestamp = (dateInput: string | Date): number => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
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

const isMonday = (date: Date): boolean => {
  return date.getUTCDay() === 1;
};

/**
 * Takes 2 objects.
 * This function is not immutable! Modifies the first object.
 * btw this was bullshit it should have been immutable!!
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
  getDateTimeStampInterval,
  printUTCTime,
  getDateTimeStampsInRange,
  getLastWeekTimeStamps,
  getWeekTimeStamps,
  getStartOfTheWeek,
  getMonthTimeStamps,
  getStartOfTheMonth,
  convertDateToDayTimestamp,
  isMonday,
};

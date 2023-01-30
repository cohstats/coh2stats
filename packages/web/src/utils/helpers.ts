import { useLocation } from "react-router-dom";
import { format } from "date-fns";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import config from "../config";
import { axisRaceIds, FirebaseTimeStampObject, ProcessedMatch, resultType } from "../coh/types";
import { userConfigType } from "../config-context";

// Something like this is not currently support by create-react-app
// Jesus that lib is such a shit https://github.com/facebook/create-react-app/issues/9127 ...
// import {convertDateToMonthTimestamp as _convertDateToMonthTimestamp} from "@coh2stats/shared/src/utils/date-helpers";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const formatDate = (dateInput: Date) => {
  return format(dateInput, "dd MMM yyyy");
};

const getYesterdayDateTimestamp = (): number => {
  const date = new Date();
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;
};

const convertDateToDayTimestamp = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
};

const convertDateToMonthTimestamp = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1000;
};

const convertDateToStartOfMonth = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  // This is very weird we need month, not UTC month which can cause skip cause of time zones
  return new Date(Date.UTC(date.getUTCFullYear(), date.getMonth(), 1));
};

const getStartOfTheWeek = (dateInput: string | Date | number) => {
  const date = new Date(dateInput);
  const diff = date.getUTCDate() - date.getUTCDay() + (date.getUTCDay() === 0 ? -6 : 1);
  return new Date(date.setUTCDate(diff));
};

const getPreviousWeekTimeStamp = () => {
  const date = getStartOfTheWeek(new Date());
  const previousWeek = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 2);
  return convertDateToDayTimestamp(getStartOfTheWeek(previousWeek));
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const formatFactionName = (name: string) => {
  name = name.toLowerCase();

  if (name === "usf") {
    return "USF";
  } else if (name === "wgerman") {
    return "WGerman";
  } else {
    return capitalize(name);
  }
};

// https://en.wikipedia.org/wiki/Root_mean_square
const calculateRMS = (...args: number[]) => {
  return Math.sqrt(
    (1 / args.length) *
      args.reduce((sum, value) => {
        // x^2
        return sum + value * value;
      }, 0),
  );
};

const firebaseTimeStampObjectToDate = (timeStampObject: FirebaseTimeStampObject) => {
  return new Date(timeStampObject._seconds * 1000);
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
  masterObject: Record<string, any>,
  newObject: Record<string, any>,
): Record<string, any> => {
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
      debugger;
      masterObject[key] = newObject[key];
    }
  }
  return masterObject;
};

const isDev = () => {
  const hostName = window.location.hostname;
  return config.devHostnames.includes(hostName);
};

const determineMatchWinner = (match: ProcessedMatch): "axis" | "allies" | "none" => {
  for (const playerReport of match.matchhistoryreportresults) {
    if (playerReport.resulttype === resultType.win) {
      if (axisRaceIds.includes(playerReport.race_id)) {
        // axis won
        return "axis";
      } else {
        // allies won
        return "allies";
      }
    }
  }

  // No-one won, this can happen in case that match was interrupted or something
  return "none";
};

const getAPIUrl = (userConfig: userConfigType) => {
  if (userConfig.api !== "gcp") {
    return config.api.cf;
  } else {
    // By default return GCP API
    return config.api.gcp;
  }
};

export {
  getYesterdayDateTimestamp,
  convertDateToDayTimestamp,
  convertDateToMonthTimestamp,
  getStartOfTheWeek,
  convertDateToStartOfMonth,
  getPreviousWeekTimeStamp,
  capitalize,
  useQuery,
  formatDate,
  calculateRMS,
  sumValuesOfObjects,
  formatFactionName,
  timeAgo,
  isDev,
  determineMatchWinner,
  getAPIUrl,
  firebaseTimeStampObjectToDate,
};

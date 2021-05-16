import { getStatsDocRef, getTopStatsDocRef } from "../../fb-paths";
import * as functions from "firebase-functions";

import {
  getCurrentDateTimestamp,
  getMonthTimeStamps,
  getStartOfTheMonth,
  getStartOfTheWeek,
  getWeekTimeStamps,
  sumValuesOfObjects,
} from "../helpers";
import { saveAnalysis, saveTopAnalysis } from "./analysis";
import { frequencyType, StatDict } from "../types";

/**
 * TODO: Implement other frequency types
 * @param date
 * @param frequency
 */
const getTimeStamps = (date: Date | number, frequency: frequencyType) => {
  switch (frequency) {
    case "week":
      return getWeekTimeStamps(date);
    case "month":
      return getMonthTimeStamps(date);
    default:
      throw Object.assign(new Error("Not implemented frequency type"), { frequency });
  }
};

const getSaveTimeStamp = (date: Date | number, frequency: frequencyType) => {
  switch (frequency) {
    case "week":
      return getCurrentDateTimestamp(getStartOfTheWeek(date));
    case "month":
      return getCurrentDateTimestamp(getStartOfTheMonth(date));
    default:
      throw Object.assign(new Error("Not implemented frequency type"), { frequency });
  }
};

const generateMultiDayAnalysis = async (
  date: Date | number,
  frequency: frequencyType = "week",
  type: "normal" | "top" = "normal",
): Promise<Record<string, any>> => {
  const eachDate = getTimeStamps(date, frequency);
  functions.logger.log(
    `Stats - ${frequency} ${type} analysis for date ${date} started - have ${eachDate.length} dates.`,
  );

  const allDocs: Record<
    string,
    FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  > = {};

  for (const timeStamp of eachDate) {
    // We need to keep the timestamp
    if (type === "top") {
      allDocs[timeStamp] = await getTopStatsDocRef(timeStamp, "daily").get();
    } else {
      allDocs[timeStamp] = await getStatsDocRef(timeStamp, "daily").get();
    }
  }

  if (!allDocs) {
    functions.logger.error(`Did not found any daily stats for ${eachDate}`);
    throw Object.assign(new Error("Not found any daily stats for"), { eachDate });
  }

  if (eachDate.length !== Object.keys(allDocs).length) {
    functions.logger.warn(`We received different amount of docs than generate timestamps
    we have ${eachDate.length} timestamp but ${Object.keys(allDocs).length} docs.`);
  }

  const finalMultiDayStats: Record<string, any> = { days: {} };

  for (const [timeStamp, doc] of Object.entries(allDocs)) {
    if (doc.exists && doc.data()) {
      const docData = doc.data();

      sumValuesOfObjects(finalMultiDayStats, docData as StatDict);

      const docCopy = JSON.parse(JSON.stringify(docData));

      if (docCopy) {
        for (const key of Object.keys(docCopy)) {
          // We don't need to keep ib and commanders for each day
          delete docCopy[key].intelBulletins;
          delete docCopy[key].commanders;
          delete docCopy[key].maps;
          delete docCopy[key].factionMatrix;
        }
      }

      finalMultiDayStats.days[timeStamp] = docCopy;
    } else {
      functions.logger.warn(`Doc missing ${doc} for timestamp ${timeStamp}`);
    }
  }

  return finalMultiDayStats;
};

const runAndSaveMultiDayAnalysis = async (
  date: Date | number,
  frequency: frequencyType = "week",
  type: "normal" | "top" = "normal",
): Promise<void> => {
  const finalMultiDayStats = await generateMultiDayAnalysis(date, frequency, type);

  const saveTimeStamp = getSaveTimeStamp(date, frequency);

  if (type === "top") {
    await saveTopAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  } else {
    await saveAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  }

  functions.logger.log(
    `Stats - ${frequency} ${type} analysis for date ${date} finished, saved under ${saveTimeStamp}`,
  );
};

export { runAndSaveMultiDayAnalysis, generateMultiDayAnalysis };

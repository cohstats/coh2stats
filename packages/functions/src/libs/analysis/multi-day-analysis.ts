import { getMapStatsDocRef, getStatsDocRef, getTopStatsDocRef } from "../../fb-paths";
import * as functions from "firebase-functions";

import {
  getCurrentDateTimestamp,
  getDateTimeStampsInRange,
  getMonthTimeStamps,
  getStartOfTheMonth,
  getStartOfTheWeek,
  getWeekTimeStamps,
  sumValuesOfObjects,
} from "../helpers";
import { saveAnalysis, saveMapAnalysis, saveTopAnalysis } from "./analysis";
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
  eachDateTimeStamp: Array<number>,
  type: "normal" | "top" | "map" = "normal",
  keepEachDay = false,
): Promise<Record<string, any>> => {
  functions.logger.log(
    `Generation of multi day analysis started - have ${eachDateTimeStamp.length} dates.`,
  );

  const allDocs: Record<
    string,
    FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  > = {};

  const promisedDocs = [];

  for (const timeStamp of eachDateTimeStamp) {
    // We need to keep the timestamp
    if (type === "top") {
      promisedDocs.push(getTopStatsDocRef(timeStamp, "daily").get());
    } else if (type === "map") {
      promisedDocs.push(getMapStatsDocRef(timeStamp, "daily").get());
    } else {
      promisedDocs.push(getStatsDocRef(timeStamp, "daily").get());
    }
  }

  const allGeneratedDocs = await Promise.all(promisedDocs);

  if (eachDateTimeStamp.length !== allGeneratedDocs.length) {
    functions.logger.warn(`We received different amount of docs than generate timestamps
    we have ${eachDateTimeStamp.length} timestamp but ${Object.keys(allDocs).length} docs.`);
    throw Object.assign(new Error("Mismatch between timestamps and received data"));
  }

  for (let i = 0; i < promisedDocs.length; i++) {
    allDocs[eachDateTimeStamp[i]] = allGeneratedDocs[i];
  }

  if (!allDocs) {
    functions.logger.error(`Did not found any daily stats for ${eachDateTimeStamp}`);
    throw Object.assign(new Error("Not found any daily stats for"), { eachDateTimeStamp });
  }

  const finalMultiDayStats: Record<string, any> = { days: {} };

  for (const [timeStamp, doc] of Object.entries(allDocs)) {
    if (doc.exists && doc.data()) {
      const docData = doc.data();

      sumValuesOfObjects(finalMultiDayStats, docData as StatDict);

      const docCopy = JSON.parse(JSON.stringify(docData));

      // Keep each day only when it's required
      if (docCopy && keepEachDay) {
        for (const key of Object.keys(docCopy)) {
          // We don't need to keep ib and commanders for each day
          delete docCopy[key].intelBulletins;
          delete docCopy[key].commanders;
          delete docCopy[key].maps;
          delete docCopy[key].factionMatrix;
        }

        finalMultiDayStats.days[timeStamp] = docCopy;
      }
    } else {
      functions.logger.warn(`Doc missing ${doc} for timestamp ${timeStamp}`);
    }
  }

  return finalMultiDayStats;
};

const runAndSaveMultiDayAnalysis = async (
  date: Date | number,
  frequency: frequencyType = "week",
  type: "normal" | "top" | "map" = "normal",
): Promise<void> => {
  const eachDate = getTimeStamps(date, frequency);
  functions.logger.log(
    `Stats - ${frequency} ${type} analysis for date ${date} started - have ${eachDate.length} dates.`,
  );

  const finalMultiDayStats = await generateMultiDayAnalysis(eachDate, type);

  const saveTimeStamp = getSaveTimeStamp(date, frequency);

  if (type === "top") {
    await saveTopAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  } else if (type === "map") {
    await saveMapAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  } else {
    await saveAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  }

  functions.logger.log(
    `Stats - ${frequency} ${type} analysis for date ${date} finished, saved under ${saveTimeStamp}`,
  );
};

const generateCustomMultiDayAnalysis = async (
  startDate: Date | number,
  endDate: Date | number,
  type: "normal" | "top" | "map" = "normal",
): Promise<Record<string, any>> => {
  const eachDate = getDateTimeStampsInRange(startDate, endDate);

  functions.logger.log(
    `Custom multi day analysis for startDate ${startDate}-${new Date(
      startDate,
    )} endDate ${endDate}-${new Date(endDate)} started - have ${eachDate.length} timestamps`,
  );

  const finalMultiDayStats = await generateMultiDayAnalysis(eachDate, type);

  functions.logger.log(
    `Custom multi day analysis for startDate ${startDate} and endDate ${endDate} finished`,
  );

  return finalMultiDayStats;
};
export { runAndSaveMultiDayAnalysis, generateMultiDayAnalysis, generateCustomMultiDayAnalysis };

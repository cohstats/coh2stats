import { getStatsDocRef } from "../../fb-paths";
import * as functions from "firebase-functions";

import {
  getCurrentDateTimestamp,
  getMonthTimeStamps,
  getStartOfTheMonth,
  getStartOfTheWeek,
  getWeekTimeStamps,
  sumValuesOfObjects,
} from "../helpers";
import { saveAnalysis } from "./analysis";
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

const runAndSaveMultiDayAnalysis = async (
  date: Date | number,
  frequency: frequencyType = "week",
): Promise<void> => {
  const eachDate = getTimeStamps(date, frequency);
  functions.logger.log(
    `Stats - ${frequency} analysis for date ${date} started - have ${eachDate.length} dates.`,
  );

  const allDocs: Record<
    string,
    FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  > = {};

  for (const timeStamp of eachDate) {
    // We need to keep the timestamp
    allDocs[timeStamp] = await getStatsDocRef(timeStamp, "daily").get();
  }

  if (!allDocs) {
    functions.logger.error(`Did not found any daily stats for ${eachDate}`);
    throw Object.assign(new Error("Not found any daily stats for"), { eachDate });
  }

  const finalMultiDayStats: Record<string, any> = { days: {} };

  for (const [timeStamp, doc] of Object.entries(allDocs)) {
    if (doc.exists && doc.data()) {
      const docData = doc.data();

      sumValuesOfObjects(finalMultiDayStats, docData as StatDict);

      if (docData) {
        for (const key of Object.keys(docData)) {
          // We don't need to keep ib and commanders for each day
          delete docData[key].intelBulletins;
          delete docData[key].commanders;
          delete docData[key].maps;
        }
      }

      finalMultiDayStats.days[timeStamp] = docData;
    }
  }

  const saveTimeStamp = getSaveTimeStamp(date, frequency);
  await saveAnalysis(finalMultiDayStats, saveTimeStamp, frequency);
  functions.logger.log(
    `Stats - ${frequency} analysis for date ${date} finished, saved under ${saveTimeStamp}`,
  );
};

export { runAndSaveMultiDayAnalysis };

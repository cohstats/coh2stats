import {
  RaceNameInLadders,
  TypeOfLadder,
  validRaceNamesInLadders,
  validStatsTypes,
} from "../types";
import { getLadderDocRef, getLadderForDayDocRef } from "../../fb-paths";
import { convertDateToDayTimestamp, isMonday } from "../helpers";
import { subDays } from "date-fns";
import { firestore } from "firebase-admin";

const db = firestore();
const batch = db.batch();

/**
 * We need to delete all sub collections and documents on the item manually because firebase doesn't
 * have simple function to delete everything ...
 * @param timestamp
 */
const deleteLadderDayRecord = async (timestamp: string | number): Promise<void> => {
  // Delete normal games
  /// "1v1", "2v2", "3v3", "4v4"
  for (const statType of validStatsTypes) {
    // "wehrmacht","usf","soviet","wgerman","british",
    for (const factionName of validRaceNamesInLadders) {
      const docRef = getLadderDocRef(
        timestamp,
        statType as TypeOfLadder,
        factionName as RaceNameInLadders,
      );
      batch.delete(docRef);
    }
  }

  for (const statType of ["team2", "team3", "team4"]) {
    // "wehrmacht","usf","soviet","wgerman","british",
    for (const factionName of ["allies", "axis"]) {
      const docRef = getLadderDocRef(
        timestamp,
        statType as TypeOfLadder,
        factionName as RaceNameInLadders,
      );
      batch.delete(docRef);
    }
  }

  const mainRef = getLadderForDayDocRef(timestamp);
  batch.delete(mainRef);

  await batch.commit();
};

const removeLadderExceptMonday = async (date: Date): Promise<void> => {
  if (isMonday(date)) {
    console.log(`${date} is Monday, keeping`);
    return;
  }

  console.log(`${date} is not Monday, removing`);
  const dayTimeStamp = convertDateToDayTimestamp(date);

  await deleteLadderDayRecord(dayTimeStamp);

  console.log(`Ladders on timestamp ${dayTimeStamp} successfully removed`);
};

const removeOldLadder = async (days = 60): Promise<void> => {
  console.log(`Cleaning ladder day which was before ${days} days`);
  const dateInHistory = subDays(new Date(), days);
  await removeLadderExceptMonday(dateInHistory);
};

export { removeOldLadder, removeLadderExceptMonday };

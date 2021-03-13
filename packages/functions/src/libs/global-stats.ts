import { getGlobalStatsDocRef } from "../fb-paths";
import { firestore } from "firebase-admin";

const globallyAnalyzedMatches = async (amountOfMatches: number): Promise<void> => {
  const statsDoc = getGlobalStatsDocRef();
  const increment = firestore.FieldValue.increment(amountOfMatches);
  await statsDoc.set({ analyzedMatches: increment }, { merge: true });
};

export { globallyAnalyzedMatches };

import { firestore } from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

const db = firestore();

const getMatchDocRef = (matchId: string | number): DocumentReference<DocumentData> => {
    return db.collection("matches").doc(`${matchId}`);
};

const getStatsDocRef = (
    timestamp: string | number,
    type: "daily" | "weekly",
): DocumentReference<DocumentData> => {
    return db.collection(`stats/${type}/`).doc(`${timestamp}`);
};

export { getMatchDocRef, getStatsDocRef };

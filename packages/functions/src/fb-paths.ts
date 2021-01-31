import { firestore } from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

const db = firestore();

const getMatchDocRef = (matchId: string | number): DocumentReference<DocumentData> => {
    return db.collection("matches").doc(`${matchId}`);
};

const getMatchStatsDocRef = (): DocumentReference<DocumentData> => {
    return db.collection("stats").doc("matchStats");
};

const getStatsDocRef = (
    timestamp: string | number,
    type: "daily" | "weekly",
): DocumentReference<DocumentData> => {
    // We need to follow pattern collection/doc/collection/doc
    return db.collection(`stats`).doc(`${type}`).collection(`${timestamp}`).doc("stats");
};

const getGlobalStatsDocRef = (): DocumentReference<DocumentData> => {
    return db.collection(`stats`).doc(`global`);
};

export { getMatchDocRef, getStatsDocRef, getGlobalStatsDocRef, getMatchStatsDocRef };

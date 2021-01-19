import { firestore } from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

const db = firestore();

const getMatchDocRef = (matchId: string | number): DocumentReference<DocumentData> => {
    return db.collection("matches").doc(`${matchId}`);
};

export { getMatchDocRef };

import {firestore} from "firebase-admin";

const db = firestore();

const getMatchDocRef = (matchId: string | number) => {
    return db.collection("matches").doc(`${matchId}`);
}

export {
    getMatchDocRef
}
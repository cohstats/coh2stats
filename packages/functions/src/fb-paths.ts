import { firestore } from "firebase-admin";
import { frequencyType, RaceNameInLadders, TypeOfLadder } from "./libs/types";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import CollectionReference = firestore.CollectionReference;

const db = firestore();

const getMatchDocRef = (matchId: string | number): DocumentReference<DocumentData> => {
  return getMatchCollectionRef().doc(`${matchId}`);
};

const getMatchCollectionRef = (): CollectionReference<DocumentData> => {
  return db.collection("matches");
};

const getStatsDocRef = (
  timestamp: string | number,
  type: frequencyType,
): DocumentReference<DocumentData> => {
  // We need to follow pattern collection/doc/collection/doc
  return db.collection(`stats`).doc(`${type}`).collection(`${timestamp}`).doc("stats");
};

const getMapStatsDocRef = (
  timestamp: string | number,
  type: frequencyType,
): DocumentReference<DocumentData> => {
  // We need to follow pattern collection/doc/collection/doc
  return db.collection(`stats`).doc(`${type}`).collection(`${timestamp}`).doc("mapStats");
};

const getTopStatsDocRef = (
  timestamp: string | number,
  type: frequencyType,
): DocumentReference<DocumentData> => {
  // We need to follow pattern collection/doc/collection/doc
  return db.collection(`stats`).doc(`${type}`).collection(`${timestamp}`).doc("topStats");
};

const getOnlinePlayersDocRef = (): DocumentReference<DocumentData> => {
  return db.collection(`stats`).doc(`onlinePlayers`);
};

const getTopLadderUniquePlayersDocRef = (
  timestamp: string | number,
  type: frequencyType,
): DocumentReference<DocumentData> => {
  // We need to follow pattern collection/doc/collection/doc
  return db
    .collection(`stats`)
    .doc(`${type}`)
    .collection(`${timestamp}`)
    .doc("topUniquePlayersAmount");
};

const getGlobalStatsDocRef = (): DocumentReference<DocumentData> => {
  return db.collection(`stats`).doc(`global`);
};

const getLadderDocRef = (
  timestamp: string | number,
  type: TypeOfLadder,
  race: RaceNameInLadders | "allies" | "axis",
): DocumentReference<DocumentData> => {
  return db.collection("ladders").doc(`${timestamp}`).collection(type).doc(race);
};

const getLadderForDayDocRef = (timestamp: string | number): DocumentReference<DocumentData> => {
  return db.collection("ladders").doc(`${timestamp}`);
};

export {
  getMatchDocRef,
  getMapStatsDocRef,
  getStatsDocRef,
  getGlobalStatsDocRef,
  getMatchCollectionRef,
  getLadderDocRef,
  getLadderForDayDocRef,
  getTopStatsDocRef,
  getTopLadderUniquePlayersDocRef,
  getOnlinePlayersDocRef,
};

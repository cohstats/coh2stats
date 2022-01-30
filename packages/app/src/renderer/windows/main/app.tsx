import * as React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../../redux/slice";
import GameOverview from "../../components/GameOverview";
import { firebaseInit } from "../../firebase/firebase";

import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

// So I am not really sure about this -- calling the function from the web package
// those helper files were not written in a way that could be easily shared - I think it inits additional things
import { convertDateToMonthTimestamp } from "@coh2ladders/web/src/utils/helpers";

// We need to initialize our Firebase
// This has to happen once on the main file in the app
firebaseInit();

const db = getFirestore();

const App = (): JSX.Element => {
  const gameData = useSelector(selectGame);

  /*
  There are 2 ways how we can get data from firestore - our database.
  1. One time request to access the data https://firebase.google.com/docs/firestore/query-data/get-data
  2. Connection which will stream the data to us and automatically update anytime there is update
  in the database - aka realtime updates https://firebase.google.com/docs/firestore/query-data/listen

  I am gonna demonstrate both ways in this file but move it to components where it makes sense!
   */

  // =========== This is real time updates ===============
  const [onlinePlayers, setOnlinePlayers] = useState(null);

  // On component mount we will register the snapshot listener
  useEffect(() => {
    onSnapshot(doc(db, "stats", "onlinePlayers"), (doc) => {
      console.log("Current data: ", doc.data());
      setOnlinePlayers(doc.data());
    });
  }, []);

  let onlinePlayersElement = "In-game players ...";

  if (onlinePlayers !== null) {
    // The date is * 1000 because we store them as unix timestamp, javascript uses different timestamp
    // We could have some element like on https://coh2stats.com/ , check packages/web/src/components/main-header.tsx:99
    // I think we could take exactly what is in that file
    onlinePlayersElement = `In game players ${onlinePlayers.onlinePlayers} on ${new Date(
      onlinePlayers.timeStamp * 1000,
    )}`;
  }

  // =========== This is one time get ===============

  // I would go for month stats because that's the best
  // For the month you need to have timestamp for the 1st of the month
  // we could use function convertDateToMonthTimestamp
  const monthTimestamp = convertDateToMonthTimestamp(new Date());
  const mapStatsForMonthRef = doc(db, `stats/month/${monthTimestamp}/`, "mapStats");

  getDoc(mapStatsForMonthRef).then((docSnap) => {
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  });

  return (
    <>
      {/*This is just example*/}
      <div>{onlinePlayersElement}</div>
      <GameOverview game={gameData} />
    </>
  );
};

export default App;

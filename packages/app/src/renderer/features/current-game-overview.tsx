import React, { useEffect, useState } from "react";
import { Factions, GameData } from "../../redux/state";
import TeamView from "../components/team-view";
// import { convertDateToMonthTimestamp } from "@coh2ladders/shared/src/utils/date-helpers";
import { doc, DocumentData, getDoc, getFirestore } from "firebase/firestore";
import GameBalanceView from "../components/game-balance-view";
import { events } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { actions, selectCache } from "../../redux/slice";
import { datesAreOnSameDay } from "../utils/helpers";

interface Props {
  game: GameData;
}

const getBiggestTeamSize = (gameData: GameData) => {
  if (gameData.left.solo.length > gameData.right.solo.length) {
    return gameData.left.solo.length;
  }
  return gameData.right.solo.length;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findMapInApiData = (apiData: DocumentData, gameData: GameData): any | undefined => {
  const minMapSize = getBiggestTeamSize(gameData);
  for (let i = minMapSize; i <= 4; i++) {
    const mapCategory = i + "v" + i;
    if (mapCategory in apiData) {
      for (const [mapName, mapData] of Object.entries(apiData[mapCategory])) {
        if (mapName.replace(/\s/g, "") === gameData.map.replace(/\s/g, "")) {
          return mapData;
        }
      }
    } else {
      console.error("Unexpected error: Did not find the map category " + mapCategory + " in api");
    }
  }
  return undefined;
};

const factionLetterLookupTable: Record<Factions, string> = {
  german: "O",
  west_german: "W",
  british: "B",
  soviet: "S",
  aef: "U",
};

const getFactionMatrix = (gameData: GameData): string => {
  let axis = gameData.left;
  let allies = gameData.right;
  if (gameData.left.side === "allies") {
    axis = gameData.right;
    allies = gameData.left;
  }
  let factionMatrixString = "";
  factionMatrixString += axis.solo
    .map((stats) => factionLetterLookupTable[stats.members[0].faction])
    .sort((a, b) => a.localeCompare(b))
    .join("");
  factionMatrixString += "x";
  factionMatrixString += allies.solo
    .map((stats) => factionLetterLookupTable[stats.members[0].faction])
    .sort((a, b) => a.localeCompare(b))
    .join("");
  return factionMatrixString;
};

const CurrentGameOverview: React.FC<Props> = ({ game }) => {
  const dispatch = useDispatch();
  const applicationCache = useSelector(selectCache);
  const [requestState, setRequestState] = useState<"loading" | "idle" | "completed">("idle");
  const [mapWinLosses, setMapWinLosses] = useState<{ wins: number; losses: number }>();
  const [mapFound, setMapFound] = useState(false);

  useEffect(() => {
    if (
      !applicationCache.mapStats ||
      !datesAreOnSameDay(new Date(applicationCache.mapStats.requestDate), new Date(Date.now()))
    ) {
      if (requestState === "idle") {
        console.log("Request new mapstats data");
        const monthTimestamp =
          Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1) / 1000;
        //Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1) / 1000;
        setRequestState("loading");
        getDoc(doc(getFirestore(), `stats/month/${monthTimestamp}/`, "mapStats")).then(
          (docSnap) => {
            if (docSnap.exists()) {
              dispatch(
                actions.setMapStatCache({
                  requestDate: Date.now(),
                  data: docSnap.data(),
                }),
              );
              setRequestState("completed");
            }
          },
        );
      }
    } else {
      const result = findMapInApiData(applicationCache.mapStats.data, game);
      // has found the map?
      if (result) {
        setMapFound(true);
        const factionMatrix = getFactionMatrix(game);
        const winLosses = result["factionMatrix"][factionMatrix];
        if (winLosses) {
          setMapWinLosses(winLosses);
        } else {
          console.warn("Not found composition on map");
        }
      } else {
        setMapFound(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, requestState]);

  useEffect(() => {
    events.game_displayed();
  }, [game]);

  return (
    <>
      <TeamView side={game.left} />
      <h1 style={{ paddingLeft: 20 }}>VS</h1>
      <TeamView side={game.right} />
      <GameBalanceView
        game={game}
        apiDataAvailable={applicationCache && applicationCache.mapStats ? true : false}
        mapFound={mapFound}
        mapCompositionEntry={mapWinLosses}
      />
    </>
  );
};

export default CurrentGameOverview;

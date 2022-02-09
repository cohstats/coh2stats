import React, { useEffect, useState } from "react";
import { Factions, GameData } from "../../redux/state";
import TeamView from "../components/team-view";
// import { convertDateToMonthTimestamp } from "@coh2ladders/shared/src/utils/date-helpers";
import { doc, DocumentData, getFirestore, onSnapshot } from "firebase/firestore";
import GameBalanceView from "../components/game-balance-view";

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
  const [mapApiData, setMapApiData] = useState(null);
  const [mapWinLosses, setMapWinLosses] = useState<{ wins: number; losses: number }>();
  const [mapFound, setMapFound] = useState(false);

  // listen map stats from firestore
  useEffect(() => {
    //convertDateToMonthTimestamp(new Date())
    const monthTimestamp =
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1) / 1000;
    //Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1) / 1000;
    onSnapshot(doc(getFirestore(), `stats/month/${monthTimestamp}/`, "mapStats"), (doc) => {
      setMapApiData(doc.data());
    });
  }, []);

  // update displayed map stats when gamedata changes
  useEffect(() => {
    // can only show valid data classic games
    if (mapApiData) {
      const result = findMapInApiData(mapApiData, game);
      // has found the map?
      if (result) {
        setMapFound(true);
        const factionMatrix = getFactionMatrix(game);
        const winLosses = result["factionMatrix"][factionMatrix];
        if (winLosses) {
          setMapWinLosses(winLosses);
        } else {
          console.log("Not found composition on map");
        }
      } else {
        setMapFound(false);
      }
    }
  }, [game, mapApiData]);

  return (
    <>
      <TeamView side={game.left} />
      <h1 style={{ paddingLeft: 20 }}>VS</h1>
      <TeamView side={game.right} />
      <GameBalanceView
        game={game}
        apiDataAvailable={mapApiData ? true : false}
        mapFound={mapFound}
        mapCompositionEntry={mapWinLosses}
      />
    </>
  );
};

export default CurrentGameOverview;

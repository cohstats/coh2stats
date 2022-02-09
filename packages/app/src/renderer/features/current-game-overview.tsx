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

/*
  const displayMapStats = () => {
    let axis = game.left;
    let allies = game.right;
    if (game.left.side === "allies") {
      axis = game.right;
      allies = game.left;
    }
    const total = mapWinLosses.wins + mapWinLosses.losses;
    const alliesMapRatio = (mapWinLosses.losses / total) * 100;
    const axisMapRatio = (mapWinLosses.wins / total) * 100;
    const axisPlayerStatWithTeam = axis.solo.map(stats => stats.teamrank > 0 ? axis.teams[stats.teamId] : stats);
    const alliesPlayerStatWithTeam = allies.solo.map(stats => stats.teamrank > 0 ? allies.teams[stats.teamId] : stats);
    console.log("allies team and solo data:", alliesPlayerStatWithTeam);
    const axisLevels = axisPlayerStatWithTeam.map(stats => stats.ranklevel);
    const alliesLevels = alliesPlayerStatWithTeam.map(stats => stats.ranklevel);
    const allPlayersHaveRanking = !axisLevels.includes(-1) && !alliesLevels.includes(-1);
    const averageAxisLevel = axisLevels.reduce((a,b) => a + b, 0) / axis.solo.length || 0;
    const averageAlliesLevel = alliesLevels.reduce((a,b) => a + b, 0) / allies.solo.length || 0;
    const averageAxisWinRatio = axisPlayerStatWithTeam.map(stats => (stats.wins / (stats.wins + stats.losses)) * 100).reduce((a,b) => a + b, 0) / axisPlayerStatWithTeam.length || 0;
    const averageAlliesWinRatio = alliesPlayerStatWithTeam.map(stats => (stats.wins / (stats.wins + stats.losses)) * 100).reduce((a,b) => a + b, 0) / alliesPlayerStatWithTeam.length || 0;
    const totalAxisStrength = averageAxisLevel * averageAxisWinRatio;
    const totalAlliesStrength = averageAlliesLevel * averageAlliesWinRatio;
    const axisRankRatio = (totalAxisStrength / (totalAxisStrength + totalAlliesStrength)) * 100;
    const alliesRankRatio = (totalAlliesStrength / (totalAxisStrength + totalAlliesStrength)) * 100;
    const axisWinPrediction = (axisRankRatio * 2 + axisMapRatio) / 3;
    const aliiesWinPrediction = (alliesRankRatio * 2 + alliesMapRatio) / 3;
    type TableDataType = {axis: React.ReactNode, label: React.ReactNode, allies: React.ReactNode};
    const createDataEntry = (axisValue: number, alliesValue: number, label: string, suffix?: string, title?: boolean): TableDataType => {
      const renderValue = (bigger: boolean, value: number, suffix?: string, title?: boolean) => {
        let color: BaseType = "danger";
        if (bigger) {
          color = "success";
        }
        if (title) {
          return <Title level={5} type={color}>{value.toFixed(1)}{suffix ? " " + suffix : null}</Title>;
        }
        return <Text type={color}>{value.toFixed(1)}{suffix ? " " + suffix : null}</Text>;
      }
      let labelJSX = <>{label}</>;
      if (title) {
        labelJSX = <Title level={5}>{label}</Title>
      }
      return {
        axis: renderValue(axisValue > alliesValue, axisValue, suffix, title),
        label: labelJSX,
        allies: renderValue(alliesValue > axisValue, alliesValue, suffix, title)
      }
    }
    const tableDataDetail: TableDataType[] = [
      createDataEntry(averageAxisLevel, averageAlliesLevel, "Average Team Level"),
      createDataEntry(averageAxisWinRatio, averageAlliesWinRatio, "Average Team Win Ratio", "%"),
      createDataEntry(axisMapRatio, alliesMapRatio, "Win Ratio for Team Composition on " + game.map + " this month", "%"),
      createDataEntry(axisWinPrediction, aliiesWinPrediction, "Total Win Ratio", "%", true),
    ];
    const tableColumns: ColumnsType<TableDataType> = [
      {
        title: (
          <>
              {axis.solo.map(stats => (
                <FactionIcon key={stats.members[0].relicID} large faction={stats.members[0].faction} style={{width: "25%", maxWidth: 80}} />
              ))}
          </>
        ),
        key: "axis",
        align: "right",
        render: (data: TableDataType) => (
          <>
            {data.axis}
          </>
        )
      },
      {
        title: (
          <>
            <Title>VS</Title>
          </>
        ),
        key: "desc",
        align: "center",
        width: 250,
        render: (data: TableDataType) => (
          <>
            {data.label}
          </>
        )
      },
      {
        title: (
          <>
              {allies.solo.map(stats => (
                <FactionIcon key={stats.members[0].relicID} large faction={stats.members[0].faction} style={{width: "25%", maxWidth: 80}} />
              ))}
          </>
        ),
        key: "allies",
        align: "left",
        render: (data: TableDataType) => (
          <>
            {data.allies}
          </>
        )
      }
    ];

    return (
      <>
        <Table style={{paddingTop: 50, paddingBottom: 50}} columns={tableColumns} dataSource={tableDataDetail} pagination={false} size={"small"} />
      </>
    )
  }

summary={(data) => (
          <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>{axisWinPrediction}</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                    Total Winrate
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {aliiesWinPrediction}
                </Table.Summary.Cell>
              </Table.Summary.Row>
          </>
        )}

        <Row style={{ paddingTop: 40}}>
          <Col span={11} style={{textAlign:"right"}}>
              {axis.solo.map(stats => (
                <FactionIcon key={stats.members[0].relicID} large faction={stats.members[0].faction} style={{width: "25%", maxWidth: 80}} />
              ))}
          </Col>
          <Col span={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Title>VS</Title>
          </Col>
          <Col span={11}>
              {allies.solo.map(stats => (
                <FactionIcon key={stats.members[0].relicID} large faction={stats.members[0].faction} style={{width: "25%", maxWidth: 80}} />
              ))}
          </Col>
        </Row>
        { allPlayersHaveRanking ? (
          <Row style={{textAlign:"center", paddingTop: 10, paddingBottom: 20}}>
            <Col span={10} style={{textAlign:"right"}}>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Average Win Ratio" value={averageAxisWinRatio} precision={2} suffix="%"/>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Average Level" value={averageAxisLevel} precision={1}/>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Win Chance" value={axisRankRatio} precision={2} suffix="%" valueStyle={{ color: axisRankRatio < 50 ? '#cf1322' : '#3f8600' }}/>
            </Col>
            <Col span={4} style={{textAlign:"center"}}>

            </Col>
            <Col span={10} style={{textAlign:"left"}}>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Win Chance" value={alliesRankRatio} precision={2} suffix="%" valueStyle={{ color: alliesRankRatio < 50 ? '#cf1322' : '#3f8600' }}/>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Average Level" value={averageAlliesLevel} precision={1}/>
              <Statistic style={{width: "30%", display: "inline-block"}} title="Average Win Ratio" value={averageAlliesWinRatio} precision={2} suffix="%"/>
            </Col>
          </Row>
        ) : null}
        <div style={{textAlign:"center", paddingTop: 10, paddingBottom: 10}}><Title level={4}>This month winrate for {game.map} with following team composition:</Title></div>
        <Row style={{textAlign:"center", paddingTop: 10, paddingBottom: 20}}>
          <Col span={10} style={{textAlign:"right"}}>
            <Statistic title="Win Chance" value={axisMapRatio} precision={2} suffix="%" valueStyle={{ color: axisMapRatio < 50 ? '#cf1322' : '#3f8600' }}/>
          </Col>
          <Col span={4} style={{textAlign:"center"}}>
            <Statistic title="Total Games" value={total}/>
          </Col>
          <Col span={10} style={{textAlign:"left"}}>
            <Statistic title="Win Chance" value={alliesMapRatio} precision={2} suffix="%" valueStyle={{ color: alliesMapRatio < 50 ? '#cf1322' : '#3f8600' }}/>
          </Col>
        </Row>
        <div style={{textAlign:"center", paddingTop: 10, paddingBottom: 10}}><Title level={4}>Prediction</Title></div>
        <Row style={{textAlign:"center", paddingTop: 10, paddingBottom: 20}}>
          <Col span={10} style={{textAlign:"right"}}>
            <Statistic title="Win Chance" value={axisWinPrediction} precision={2} suffix="%" valueStyle={{ color: axisWinPrediction < 50 ? '#cf1322' : '#3f8600' }}/>
          </Col>
          <Col span={4} style={{textAlign:"center"}}>
          </Col>
          <Col span={10} style={{textAlign:"left"}}>
            <Statistic title="Win Chance" value={aliiesWinPrediction} precision={2} suffix="%" valueStyle={{ color: aliiesWinPrediction < 50 ? '#cf1322' : '#3f8600' }}/>
          </Col>
        </Row>
*/

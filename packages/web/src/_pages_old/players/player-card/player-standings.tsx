import React from "react";
import PlayerSingleMatchesTable from "./player-single-matches-table";
import PlayerTeamMatchesTable from "./player-team-matches-table";
import { findAndMergeStatGroups } from "../../../coh/helpers";
import { HistoricLeaderBoardStats, LaddersDataObject } from "../../../coh/types";
import { prepareLeaderBoardDataForSinglePlayer } from "./data-processing";
import { Typography } from "antd";
import { mergeLadderDataAndHistoricData } from "./helpers";

const { Title } = Typography;

const specificOrderOfAITables = (keys: Array<string>) => {
  const sortBy = [
    "AIEasyAllies",
    "AIMediumAllies",
    "AIHardAllies",
    "AIExpertAllies",
    "AIEasyAxis",
    "AIMediumAxis",
    "AIHardAxis",
    "AIExpertAxis",
  ];

  return keys.sort((a, b) => sortBy.indexOf(a) - sortBy.indexOf(b));
};

const splitAIGames = (keys: Array<string>) => {
  const alliesAIGames = [];
  const axisAIGames = [];

  for (let key of keys) {
    if (key.endsWith("Allies")) {
      alliesAIGames.push(key);
    } else {
      axisAIGames.push(key);
    }
  }

  return {
    alliesAIGames,
    axisAIGames,
  };
};

interface IProps {
  data: LaddersDataObject;
  historicLeaderboardStats?: HistoricLeaderBoardStats | null;
}

const PlayerStandingsTables: React.FC<IProps> = ({ data, historicLeaderboardStats }) => {
  // Mutating the data object, vomit incoming
  mergeLadderDataAndHistoricData(data, historicLeaderboardStats);
  const mergedGamesData = findAndMergeStatGroups(data as LaddersDataObject, null);
  const { finalStatsSingleGame, finalStatsTeamGames, finalStatsCustomGames, finalStatsAIGame } =
    prepareLeaderBoardDataForSinglePlayer(mergedGamesData);

  const singleTables: Array<any> = [];
  const teamTables: Array<any> = [];

  const { alliesAIGames, axisAIGames } = splitAIGames(
    specificOrderOfAITables(Object.keys(finalStatsAIGame)),
  );
  const aiTablesAllies: Array<any> = [];
  const aiTablesAxis: Array<any> = [];

  for (const key of Object.keys(finalStatsSingleGame)) {
    singleTables.push(
      <PlayerSingleMatchesTable key={key} title={key} data={finalStatsSingleGame[key]} />,
    );
  }

  for (const key of alliesAIGames) {
    aiTablesAllies.push(
      <PlayerSingleMatchesTable key={key} title={key} data={finalStatsAIGame[key]} />,
    );
  }

  for (const key of axisAIGames) {
    aiTablesAxis.push(
      <PlayerSingleMatchesTable key={key} title={key} data={finalStatsAIGame[key]} />,
    );
  }

  for (const key of Object.keys(finalStatsTeamGames)) {
    if (finalStatsTeamGames[key].length !== 0) {
      teamTables.push(
        <PlayerTeamMatchesTable key={key} title={key} data={finalStatsTeamGames[key]} />,
      );
    }
  }

  return (
    <>
      {singleTables}
      {teamTables}
      {alliesAIGames.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <Title level={3}>AI Games - Allies </Title>
        </div>
      )}
      {aiTablesAllies}
      {axisAIGames.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <Title level={3}>AI Games - Axis</Title>
        </div>
      )}
      {aiTablesAxis}
      {finalStatsCustomGames.length > 0 && (
        <>
          <div style={{ textAlign: "center" }}>
            <Title level={3}>Custom Games</Title>
          </div>
          <PlayerSingleMatchesTable
            key={"customGames"}
            title={"Custom Games"}
            data={finalStatsCustomGames}
          />
        </>
      )}
    </>
  );
};

export default PlayerStandingsTables;

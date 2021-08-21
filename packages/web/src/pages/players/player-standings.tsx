import React from "react";
import PlayerSingleMatchesTable from "./player-single-matches-table";
import PlayerTeamMatchesTable from "./player-team-matches-table";
import { findAndMergeStatGroups } from "../../coh/helpers";
import { LaddersDataObject } from "../../coh/types";
import { prepareLeaderBoardDataForSinglePlayer } from "./data-processing";

interface IProps {
  data: LaddersDataObject;
}

const PlayerStandingsTables: React.FC<IProps> = ({ data }) => {
  const mergedGamesData = findAndMergeStatGroups(data as LaddersDataObject, null);
  const { finalStatsSingleGame, finalStatsTeamGames } =
    prepareLeaderBoardDataForSinglePlayer(mergedGamesData);

  const singleTables: Array<any> = [];
  const teamTables: Array<any> = [];

  for (const key of Object.keys(finalStatsSingleGame)) {
    singleTables.push(
      <PlayerSingleMatchesTable key={key} title={key} data={finalStatsSingleGame[key]} />,
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
    </>
  );
};

export default PlayerStandingsTables;

import { ColumnsType } from "antd/lib/table";
import { BaseType } from "antd/lib/typography/Base";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React from "react";
import { GameData, SideData, LadderStats } from "../../redux/state";
import { FactionIcon } from "./faction-icon";
import Table from "antd/lib/table/Table";
import { Helper } from "@coh2ladders/shared/src/components/helper";
import { Typography } from "antd";

const findAllStatsForEachPlayerInSide = (side: SideData): LadderStats[][] => {
  const result: LadderStats[][] = new Array(side.solo.length);
  side.solo.forEach((soloStat, index) => {
    result[index] = [];
    // only include stats with a ranking
    if (soloStat.rank > 0) {
      result[index].push(soloStat);
    }
    side.teams.forEach((teamStat) => {
      if (teamStat.rank > 0) {
        teamStat.members.forEach((teamMember) => {
          if (teamMember.relicID === soloStat.members[0].relicID) {
            result[index].push(teamStat);
          }
        });
      }
    });
  });
  return result;
};

const allPlayersInSideHaveRanking = (statsMatrix: LadderStats[][]): boolean => {
  let allHaveARanking = true;
  statsMatrix.forEach((stats) => {
    if (stats.length === 0) {
      allHaveARanking = false;
    }
  });
  return allHaveARanking;
};

const GetAverageTeamValue = (
  statsMatrix: LadderStats[][],
  mapFunc: (stats: LadderStats) => number,
): number => {
  const flatLadderStatsArray = statsMatrix.flat(1);
  return (
    flatLadderStatsArray.map(mapFunc).reduce((a, b) => a + b, 0) / flatLadderStatsArray.length ||
    0
  );
};

interface Props {
  game: GameData;
  mapCompositionEntry: { wins: number; losses: number };
}

const GameBalanceView: React.FC<Props> = ({ game, mapCompositionEntry }) => {
  let axis = game.left;
  let allies = game.right;
  if (game.left.side === "allies") {
    axis = game.right;
    allies = game.left;
  }
  const axisPlayerStats = findAllStatsForEachPlayerInSide(axis);
  const alliesPlayerStats = findAllStatsForEachPlayerInSide(allies);
  const totalMapCompositionDataPoints = mapCompositionEntry.wins + mapCompositionEntry.losses;

  if (
    game.type !== "classic" ||
    totalMapCompositionDataPoints < 5 || // minimum 5 games necessary for map stats
    !allPlayersInSideHaveRanking(axisPlayerStats) ||
    !allPlayersInSideHaveRanking(alliesPlayerStats)
  ) {
    return <></>;
  }
  const axisAverageLevel = GetAverageTeamValue(axisPlayerStats, (stats) => stats.ranklevel);
  const alliesAverageLevel = GetAverageTeamValue(alliesPlayerStats, (stats) => stats.ranklevel);
  const axisAverageWinRatio = GetAverageTeamValue(
    axisPlayerStats,
    (stats) => (stats.wins / (stats.wins + stats.losses)) * 100,
  );
  const alliesAverageWinRatio = GetAverageTeamValue(
    alliesPlayerStats,
    (stats) => (stats.wins / (stats.wins + stats.losses)) * 100,
  );
  const axisMapWinRatio = (mapCompositionEntry.wins / totalMapCompositionDataPoints) * 100;
  const alliesMapWinRatio = (mapCompositionEntry.losses / totalMapCompositionDataPoints) * 100;

  // Calculate a total win ratio from the above data
  const axisStrength = axisAverageLevel * axisAverageWinRatio;
  const alliesStrength = alliesAverageLevel * alliesAverageWinRatio;
  const axisStrengthRatio = (axisStrength / (axisStrength + alliesStrength)) * 100;
  const alliesStrengthRatio = (alliesStrength / (axisStrength + alliesStrength)) * 100;

  const axisTotalWinRatio = (axisStrengthRatio + axisMapWinRatio) / 2;
  const alliesTotalWinRatio = (alliesStrengthRatio + alliesMapWinRatio) / 2;

  type ComparisonDataType = {
    axis: React.ReactNode;
    label: React.ReactNode;
    allies: React.ReactNode;
    key: number;
  };
  const createComparisonDataEntry = (
    key: number,
    axisValue: number,
    alliesValue: number,
    label: React.ReactNode,
    suffix?: string,
    title?: boolean,
  ): ComparisonDataType => {
    const renderValue = (bigger: boolean, value: number, suffix?: string, title?: boolean) => {
      let color: BaseType = "danger";
      if (bigger) {
        color = "success";
      }
      if (title) {
        return (
          <Title level={5} type={color}>
            {value.toFixed(1)}
            {suffix ? " " + suffix : null}
          </Title>
        );
      }
      return (
        <Text type={color}>
          {value.toFixed(1)}
          {suffix ? " " + suffix : null}
        </Text>
      );
    };
    let labelJSX = <>{label}</>;
    if (title) {
      labelJSX = <Title level={5}>{label}</Title>;
    }
    return {
      axis: renderValue(axisValue > alliesValue, axisValue, suffix, title),
      label: labelJSX,
      allies: renderValue(alliesValue > axisValue, alliesValue, suffix, title),
      key: key,
    };
  };
  const tableDataSource: ComparisonDataType[] = [
    createComparisonDataEntry(0, axisAverageLevel, alliesAverageLevel, "Average Team Level"),
    createComparisonDataEntry(
      1,
      axisAverageWinRatio,
      alliesAverageWinRatio,
      <>Average Team Win Ratio</>,
      "%",
    ),
    createComparisonDataEntry(
      2,
      axisMapWinRatio,
      alliesMapWinRatio,
      <>
        Win Ratio for this Faction Composition{" "}
        <Helper
          text={
            <>
              Based on{" "}
              <Typography.Link
                onClick={() =>
                  window.electron.ipcRenderer.openInBrowser(
                    "https://coh2stats.com/map-stats?range=month&type=" +
                      game.left.solo.length +
                      "v" +
                      game.left.solo.length +
                      "&map=" +
                      game.map,
                  )
                }
              >
                coh2stats.com{" "}
              </Typography.Link>
              map analysis.
            </>
          }
        />
      </>,
      "%",
    ),
    createComparisonDataEntry(
      3,
      axisTotalWinRatio,
      alliesTotalWinRatio,
      <>
        Victory Chance Probability{" "}
        <Helper
          text={
            <>
              This is probability of victory based on average team level, average players winrate
              and factions composition matchup win ratio
            </>
          }
        />
      </>,
      "%",
      true,
    ),
  ];

  const renderFactionIcon = (stats: LadderStats) => (
    <FactionIcon
      key={stats.members[0].relicID}
      large
      faction={stats.members[0].faction}
      style={{ width: "25%", maxWidth: 50 }}
    />
  );

  const tableColumns: ColumnsType<ComparisonDataType> = [
    {
      title: <>{axis.solo.map(renderFactionIcon)}</>,
      key: "axis",
      align: "right",
      render: (data: ComparisonDataType) => <>{data.axis}</>,
    },
    {
      title: (
        <>
          <Title style={{ paddingTop: 8 }}>VS</Title>
        </>
      ),
      key: "desc",
      align: "center",
      width: 250,
      render: (data: ComparisonDataType) => <>{data.label}</>,
    },
    {
      title: <>{allies.solo.map(renderFactionIcon)}</>,
      key: "allies",
      align: "left",
      render: (data: ComparisonDataType) => <>{data.allies}</>,
    },
  ];

  return (
    <>
      <Table
        style={{ paddingTop: 50, paddingBottom: 50 }}
        columns={tableColumns}
        dataSource={tableDataSource}
        rowKey={(data) => data.key}
        pagination={false}
        size={"small"}
      />
    </>
  );
};

export default GameBalanceView;

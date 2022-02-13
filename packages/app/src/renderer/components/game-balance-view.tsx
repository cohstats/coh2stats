import { ColumnsType } from "antd/lib/table";
import { BaseType } from "antd/lib/typography/Base";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import Tooltip from "antd/lib/tooltip/index";
import React from "react";
import { GameData, SideData, LadderStats } from "../../redux/state";
import { FactionIcon } from "./faction-icon";
import Table from "antd/lib/table/Table";
import { Helper } from "@coh2ladders/shared/src/components/helper";
import { Typography } from "antd";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";

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

interface ComparisonSide {
  available: boolean;
  value: number;
  reason: React.ReactNode;
}

interface ComparisonData {
  label: React.ReactNode;
  suffix?: string;
  left: ComparisonSide;
  right: ComparisonSide;
}

type ComparisonDataEntry = {
  left: React.ReactNode;
  label: React.ReactNode;
  right: React.ReactNode;
  key: number;
};

interface Props {
  game: GameData;
  apiDataAvailable: boolean;
  mapFound: boolean;
  mapCompositionEntry?: { wins: number; losses: number };
}

const GameBalanceView: React.FC<Props> = ({
  game,
  mapCompositionEntry,
  mapFound,
  apiDataAvailable,
}) => {
  let mapDataAvailable = true;
  let noMapDataReason: React.ReactNode = "";
  let leftMapWinRatio = -1;
  let rightMapWinRatio = -1;
  if (!apiDataAvailable) {
    mapDataAvailable = false;
    noMapDataReason = "No map data from API recieved yet.";
  }
  if (mapDataAvailable && !mapFound) {
    mapDataAvailable = false;
    noMapDataReason = "Stats for custom maps are not available";
  }
  if (mapDataAvailable && game.type !== "classic") {
    mapDataAvailable = false;
    noMapDataReason =
      "Map data only available for Axis vs Allies Games without AI and equal Team size.";
  }
  if (mapDataAvailable && !mapCompositionEntry) {
    mapDataAvailable = false;
    noMapDataReason = "No data for this team composition on this map is available";
  }
  if (mapDataAvailable && mapCompositionEntry) {
    const totalMapCompositionDataPoints = mapCompositionEntry.wins + mapCompositionEntry.losses;
    if (totalMapCompositionDataPoints < 5) {
      // minimum 5 games necessary for map stats
      mapDataAvailable = false;
      noMapDataReason =
        "There are not enough games for this team composition on this map. Minimum 5 games needed.";
    } else {
      const axisMapWinRatio = (mapCompositionEntry.wins / totalMapCompositionDataPoints) * 100;
      const alliesMapWinRatio =
        (mapCompositionEntry.losses / totalMapCompositionDataPoints) * 100;
      leftMapWinRatio = game.left.side === "axis" ? axisMapWinRatio : alliesMapWinRatio;
      rightMapWinRatio = game.right.side === "axis" ? axisMapWinRatio : alliesMapWinRatio;
    }
  }

  const leftPlayerStats = findAllStatsForEachPlayerInSide(game.left);
  const rightPlayerStats = findAllStatsForEachPlayerInSide(game.right);
  const leftAllRanked = allPlayersInSideHaveRanking(leftPlayerStats);
  const rightAllRanked = allPlayersInSideHaveRanking(rightPlayerStats);
  const notAllRankedReason: React.ReactNode = "Not all players have a ranking";

  let leftAverageLevel = -1;
  let leftAverageWinRatio = -1;
  if (leftAllRanked) {
    leftAverageLevel = GetAverageTeamValue(leftPlayerStats, (stats) => stats.ranklevel);
    leftAverageWinRatio = GetAverageTeamValue(
      leftPlayerStats,
      (stats) => (stats.wins / (stats.wins + stats.losses)) * 100,
    );
  }

  let rightAverageLevel = -1;
  let rightAverageWinRatio = -1;
  if (rightAllRanked) {
    rightAverageLevel = GetAverageTeamValue(rightPlayerStats, (stats) => stats.ranklevel);
    rightAverageWinRatio = GetAverageTeamValue(
      rightPlayerStats,
      (stats) => (stats.wins / (stats.wins + stats.losses)) * 100,
    );
  }

  let totalVictoryChanceAvailable = true;
  let noTotalVictoryChanceReason: React.ReactNode = "";
  let leftTotalWinRatio = -1;
  let rightTotalWinRatio = -1;
  if (!leftAllRanked || !rightAllRanked) {
    totalVictoryChanceAvailable = false;
    noTotalVictoryChanceReason = "All players have to have a ranking";
  }
  if (totalVictoryChanceAvailable && !mapDataAvailable) {
    totalVictoryChanceAvailable = false;
    noTotalVictoryChanceReason = "Win Ratio for this Faction Composition not available";
  }
  if (totalVictoryChanceAvailable) {
    const leftStrength = leftAverageLevel * leftAverageWinRatio;
    const rightStrength = rightAverageLevel * rightAverageWinRatio;
    const leftStrengthRatio = (leftStrength / (leftStrength + rightStrength)) * 100;
    const rightStrengthRatio = (rightStrength / (rightStrength + leftStrength)) * 100;
    leftTotalWinRatio = (leftStrengthRatio + leftMapWinRatio) / 2;
    rightTotalWinRatio = (rightStrengthRatio + rightMapWinRatio) / 2;
  }

  const createComparisonDataEntry = (
    key: number,
    comparisonData: ComparisonData,
    title?: boolean,
  ): ComparisonDataEntry => {
    const renderValue = (
      textColor: BaseType | undefined,
      comparisonSide: ComparisonSide,
      suffix?: string,
      title?: boolean,
    ) => {
      const content = (
        <>
          {comparisonSide.available ? (
            <>
              {comparisonSide.value.toFixed(1)}
              {suffix ? " " + suffix : null}
            </>
          ) : (
            <>
              <Tooltip title={comparisonSide.reason}>N/A</Tooltip>
            </>
          )}
        </>
      );
      if (title) {
        return (
          <Title level={5} type={textColor}>
            {content}
          </Title>
        );
      }
      return <Text type={textColor}>{content}</Text>;
    };
    let labelJSX = <>{comparisonData.label}</>;
    if (title) {
      labelJSX = <Title level={5}>{comparisonData.label}</Title>;
    }
    let leftTextColor: BaseType | undefined = undefined;
    let rightTextColor: BaseType | undefined = undefined;
    if (comparisonData.left.available && comparisonData.right.available) {
      leftTextColor =
        comparisonData.left.value >= comparisonData.right.value ? "success" : "danger";
      rightTextColor =
        comparisonData.right.value >= comparisonData.left.value ? "success" : "danger";
    }
    return {
      left: renderValue(leftTextColor, comparisonData.left, comparisonData.suffix, title),
      label: labelJSX,
      right: renderValue(rightTextColor, comparisonData.right, comparisonData.suffix, title),
      key: key,
    };
  };

  const tableDataSource: ComparisonDataEntry[] = [
    createComparisonDataEntry(0, {
      label: "Average Team Level",
      left: {
        available: leftAllRanked,
        value: leftAverageLevel,
        reason: notAllRankedReason,
      },
      right: {
        available: rightAllRanked,
        value: rightAverageLevel,
        reason: notAllRankedReason,
      },
    }),
    createComparisonDataEntry(1, {
      label: <>Average Team Win Ratio</>,
      suffix: "%",
      left: {
        available: leftAllRanked,
        value: leftAverageWinRatio,
        reason: notAllRankedReason,
      },
      right: {
        available: rightAllRanked,
        value: rightAverageWinRatio,
        reason: notAllRankedReason,
      },
    }),
    createComparisonDataEntry(2, {
      label: (
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
        </>
      ),
      suffix: "%",
      left: {
        available: mapDataAvailable,
        value: leftMapWinRatio,
        reason: noMapDataReason,
      },
      right: {
        available: mapDataAvailable,
        value: rightMapWinRatio,
        reason: noMapDataReason,
      },
    }),
    createComparisonDataEntry(
      3,
      {
        label: (
          <>
            Victory Chance Probability{" "}
            <Helper
              text={
                <>
                  This is probability of victory based on average team level, average players
                  winrate and factions composition matchup win ratio
                </>
              }
            />
          </>
        ),
        suffix: "%",
        left: {
          available: totalVictoryChanceAvailable,
          value: leftTotalWinRatio,
          reason: noTotalVictoryChanceReason,
        },
        right: {
          available: totalVictoryChanceAvailable,
          value: rightTotalWinRatio,
          reason: noTotalVictoryChanceReason,
        },
      },
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

  const tableColumns: ColumnsType<ComparisonDataEntry> = [
    {
      title: <>{game.left.solo.map(renderFactionIcon)}</>,
      key: "left",
      align: "right",
      render: (data: ComparisonDataEntry) => <>{data.left}</>,
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
      render: (data: ComparisonDataEntry) => <>{data.label}</>,
    },
    {
      title: <>{game.right.solo.map(renderFactionIcon)}</>,
      key: "right",
      align: "left",
      render: (data: ComparisonDataEntry) => <>{data.right}</>,
    },
  ];

  return (
    <>
      <Table
        style={{ paddingTop: 50 }}
        columns={tableColumns}
        dataSource={tableDataSource}
        rowKey={(data) => data.key}
        pagination={false}
        size={"small"}
      />
      <Text italic style={{ paddingBottom: 50 }}>
        <InfoCircleOutlined /> Stats missing? Hover over them to find out the reason.
      </Text>
    </>
  );
};

export default GameBalanceView;

"use client";

import React, { useMemo } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaderboardPlayerCount, ModeMinMax } from "../page";
import { formatFactionName } from "@/utils/helpers";
import { LeaderboardPieCharts } from "./leaderboard-pie-charts";
import Image from "next/image";
import { getGeneralIconImport } from "@/coh/generalIconImports";

const { Title, Text } = Typography;

interface LeaderboardStatsContentProps {
  leaderboardData: LeaderboardPlayerCount[];
  normalModeMinMax: Record<string, ModeMinMax>;
  teamModeMinMax: Record<string, ModeMinMax>;
}

interface NormalModeTableRow {
  key: string;
  faction: string;
  "1v1": number;
  "2v2": number;
  "3v3": number;
  "4v4": number;
}

interface TeamModeTableRow {
  key: string;
  faction: string;
  "2v2": number;
  "3v3": number;
  "4v4": number;
}

const factionOrder = ["usf", "british", "wgerman", "wehrmacht", "soviet"];
const teamFactionOrder = ["axis", "allies"];

export const LeaderboardStatsContent = ({
  leaderboardData,
  normalModeMinMax,
  teamModeMinMax,
}: LeaderboardStatsContentProps): React.ReactElement => {
  const normalModeData: NormalModeTableRow[] = useMemo(() => {
    const factionData: Record<string, Partial<NormalModeTableRow>> = {};

    leaderboardData.forEach((item) => {
      if (["1v1", "2v2", "3v3", "4v4"].includes(item.mode)) {
        if (!factionData[item.faction]) {
          factionData[item.faction] = {
            key: item.faction,
            faction: item.faction,
          };
        }
        factionData[item.faction][item.mode as "1v1" | "2v2" | "3v3" | "4v4"] =
          item.playerCount;
      }
    });

    // Sort by faction order
    return factionOrder
      .filter((faction) => factionData[faction])
      .map((faction) => factionData[faction] as NormalModeTableRow);
  }, [leaderboardData]);

  const teamModeData: TeamModeTableRow[] = useMemo(() => {
    const factionData: Record<string, Partial<TeamModeTableRow>> = {};

    leaderboardData.forEach((item) => {
      if (["team2", "team3", "team4"].includes(item.mode)) {
        if (!factionData[item.faction]) {
          factionData[item.faction] = {
            key: item.faction,
            faction: item.faction,
          };
        }
        const mode = item.mode.replace("team", "") + "v" + item.mode.replace("team", "");
        factionData[item.faction][mode as "2v2" | "3v3" | "4v4"] = item.playerCount;
      }
    });

    // Sort by team faction order
    return teamFactionOrder
      .filter((faction) => factionData[faction])
      .map((faction) => factionData[faction] as TeamModeTableRow);
  }, [leaderboardData]);

  const normalModeColumns: ColumnsType<NormalModeTableRow> = [
    {
      title: "Faction",
      dataIndex: "faction",
      key: "faction",
      render: (faction: string) => (
        <>
          <Image
            src={getGeneralIconImport(faction, "small")}
            width={18}
            height={18}
            alt={faction}
            style={{ marginRight: 8, verticalAlign: "middle" }}
          />
          {formatFactionName(faction)}
        </>
      ),
      fixed: "left",
      width: 200,
    },
    {
      title: "1 vs 1",
      dataIndex: "1v1",
      key: "1v1",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = normalModeMinMax["1v1"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
    {
      title: "2 vs 2",
      dataIndex: "2v2",
      key: "2v2",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = normalModeMinMax["2v2"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
    {
      title: "3 vs 3",
      dataIndex: "3v3",
      key: "3v3",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = normalModeMinMax["3v3"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
    {
      title: "4 vs 4",
      dataIndex: "4v4",
      key: "4v4",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = normalModeMinMax["4v4"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
  ];

  const teamModeColumns: ColumnsType<TeamModeTableRow> = [
    {
      title: "Faction",
      dataIndex: "faction",
      key: "faction",
      render: (faction: string) => {
        // For team games, show multiple faction icons
        if (faction === "axis") {
          return (
            <>
              <Image
                src={getGeneralIconImport("wehrmacht", "small")}
                width={18}
                height={18}
                alt="Wehrmacht"
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              <Image
                src={getGeneralIconImport("wgerman", "small")}
                width={18}
                height={18}
                alt="WGerman"
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              {formatFactionName(faction)}
            </>
          );
        } else if (faction === "allies") {
          return (
            <>
              <Image
                src={getGeneralIconImport("soviet", "small")}
                width={18}
                height={18}
                alt="Soviet"
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              <Image
                src={getGeneralIconImport("british", "small")}
                width={18}
                height={18}
                alt="British"
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              <Image
                src={getGeneralIconImport("usf", "small")}
                width={18}
                height={18}
                alt="USF"
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              {formatFactionName(faction)}
            </>
          );
        }
        return formatFactionName(faction);
      },
      fixed: "left",
      width: 200,
    },
    {
      title: "2 vs 2",
      dataIndex: "2v2",
      key: "2v2",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = teamModeMinMax["2v2"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
    {
      title: "3 vs 3",
      dataIndex: "3v3",
      key: "3v3",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = teamModeMinMax["3v3"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
    {
      title: "4 vs 4",
      dataIndex: "4v4",
      key: "4v4",
      align: "center",
      render: (count: number) => {
        if (!count) return "-";
        const minMax = teamModeMinMax["4v4"];
        const color = minMax && count === minMax.max
          ? "#52c41a" // green
          : minMax && count === minMax.min
          ? "#ff4d4f" // red
          : undefined;
        return <span style={{ color, fontWeight: color ? "bold" : "normal" }}>{count.toLocaleString()}</span>;
      },
    },
  ];

  return (
    <>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Amount of players in leaderboards
        </Title>

        <Table
          columns={normalModeColumns}
          dataSource={normalModeData}
          pagination={false}
          size="small"
          bordered
          footer={() => (
            <Text
              italic
              type="secondary"
              style={{ fontSize: 12, textAlign: "center", display: "block" }}
            >
              Keep in mind that one player is usually ranked in various modes. You can&apos;t sum up
              all numbers.
            </Text>
          )}
          style={{ marginBottom: 24 }}
        />

        <Table
          columns={teamModeColumns}
          dataSource={teamModeData}
          pagination={false}
          size="small"
          bordered
          title={() => <Text strong>Team Games</Text>}
          footer={() => (
            <Text
              italic
              type="secondary"
              style={{ fontSize: 12, textAlign: "center", display: "block" }}
            >
              Keep in mind that one player is usually ranked in various modes. You can&apos;t sum up
              all numbers.
            </Text>
          )}
        />
      </div>

      <LeaderboardPieCharts leaderboardData={leaderboardData} />
    </>
  );
};

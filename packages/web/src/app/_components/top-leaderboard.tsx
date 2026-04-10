"use client";

import React, { useState, useMemo } from "react";
import { Table, Segmented, Tooltip } from "antd";
import Link from "next/link";
import type { TableColumnsType } from "antd";
import type {
  RelicLeaderboardResponse,
  LaddersDataObject,
  RelicLeaderboardStat,
  RelicStatGroupMember,
} from "@/coh/types";
import { timeAgo } from "@/utils/helpers";
import { convertSteamNameToID } from "@/coh/helpers";
import routes from "@/routes";
import { CountryFlag } from "@/components/country-flag";

type FactionKey = "wehrmacht" | "soviet" | "wgerman" | "usf" | "british";

interface LeaderboardRowData {
  rank: number;
  change: number | string;
  alias: string;
  steamName: string;
  country: string;
  streak: number;
  wins: number;
  losses: number;
  lastmatchdate: number;
  statgroup_id: number;
}

interface TopLeaderboardProps {
  leaderboardData: Record<
    string,
    {
      current: RelicLeaderboardResponse | null;
      historic: LaddersDataObject | null;
    }
  >;
}

export function TopLeaderboard({ leaderboardData }: TopLeaderboardProps) {
  const [selectedFaction, setSelectedFaction] = useState<FactionKey>("wehrmacht");

  const factionOptions = [
    { label: "Wehrmacht", value: "wehrmacht" },
    { label: "Soviet", value: "soviet" },
    { label: "OKW", value: "wgerman" },
    { label: "USF", value: "usf" },
    { label: "British", value: "british" },
  ];

  // Process and merge current and historic data
  const tableData = useMemo((): LeaderboardRowData[] => {
    const data = leaderboardData[selectedFaction];
    if (!data?.current) return [];

    const { current, historic } = data;
    const result: LeaderboardRowData[] = [];

    // Merge statGroups and leaderboardStats
    for (let i = 0; i < current.leaderboardStats.length; i++) {
      const stat: RelicLeaderboardStat = current.leaderboardStats[i];
      const statGroup = current.statGroups.find((group) => group.id === stat.statgroup_id);

      if (!statGroup || statGroup.members.length === 0) continue;

      const member: RelicStatGroupMember = statGroup.members[0];

      // Calculate rank change
      let change: number | string = 0;
      if (historic) {
        const historicStat = historic.leaderboardStats.find(
          (s) => s.statgroup_id === stat.statgroup_id,
        );
        if (historicStat) {
          change = historicStat.rank - stat.rank; // Positive means improved
        } else {
          change = "new";
        }
      }

      result.push({
        rank: stat.rank,
        change,
        alias: member.alias,
        steamName: member.name,
        country: member.country,
        streak: stat.streak,
        wins: stat.wins,
        losses: stat.losses,
        lastmatchdate: stat.lastmatchdate,
        statgroup_id: stat.statgroup_id,
      });
    }

    return result;
  }, [leaderboardData, selectedFaction]);

  const columns: TableColumnsType<LeaderboardRowData> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center",
      width: 60,
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      align: "center",
      width: 80,
      render: (data: number | string) => {
        if (typeof data === "number") {
          if (data > 0) {
            return <div style={{ color: "#52c41a" }}>+{data}</div>;
          } else if (data < 0) {
            return <div style={{ color: "#ff4d4f" }}>{data}</div>;
          } else {
            return <div>-</div>;
          }
        }
        return <div>{data}</div>;
      },
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
      render: (_: string, record: LeaderboardRowData) => {
        const steamId = convertSteamNameToID(record.steamName);
        return (
          <Link href={routes.playerCardWithId(steamId)} rel="nofollow noindex" prefetch={false}>
            <CountryFlag
              countryCode={record.country}
              style={{ width: "1.2em", height: "1.2em", paddingRight: 0 }}
            />{" "}

              {record.alias}
            </Link>
        );
      },
    },
    {
      title: "Streak",
      dataIndex: "streak",
      key: "streak",
      align: "center",
      width: 70,
      render: (data: number) => {
        if (data > 0) {
          return <div style={{ color: "#52c41a" }}>+{data}</div>;
        } else if (data < 0) {
          return <div style={{ color: "#ff4d4f" }}>{data}</div>;
        }
        return <div>{data}</div>;
      },
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center",
      width: 70,
      render: (_: any, record: LeaderboardRowData) => {
        const ratio = Math.round(100 * (record.wins / (record.losses + record.wins)));
        return <div>{ratio}%</div>;
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center",
      width: 70,
      render: (_: any, record: LeaderboardRowData) => {
        return <>{record.wins + record.losses}</>;
      },
    },
    {
      title: "Last Game",
      dataIndex: "lastmatchdate",
      key: "lastmatchdate",
      align: "right",
      width: 120,
      render: (data: number) => {
        return (
          <Tooltip title={new Date(data * 1000).toLocaleString()}>
            {timeAgo.format(Date.now() - (Date.now() - data * 1000), "round-minute")}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      size="small"
      pagination={false}
      rowKey={(record) => record.statgroup_id}
      scroll={{ x: 600 }}
      loading={!tableData.length}
      title={() => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Top 1v1 Leaderboard</span>
          <Segmented
            options={factionOptions}
            value={selectedFaction}
            onChange={(value) => setSelectedFaction(value as FactionKey)}
          />
        </div>
      )}
      style={{ width: "100%", maxWidth: 800 }}
    />
  );
}

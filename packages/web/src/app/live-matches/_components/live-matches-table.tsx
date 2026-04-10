"use client";

import React, { useEffect, useState } from "react";
import { Row, Table, Typography } from "antd";
import { LiveGame, StatsCurrentLiveGames } from "../../../coh/types";
import { isDev } from "../../../utils/helpers";
import { TeamOutlined } from "@ant-design/icons";
import { AlertBox } from "../../../components/alert-box";
import {
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  raceIds,
} from "../../../utils/table-functions";
import { convertSteamNameToID } from "../../../coh/helpers";
import { getGeneralIconImport } from "../../../coh/generalIconImports";
import Link from "next/link";
import NextImage from "next/image";
import routes from "../../../routes";
import { TableColumnsType, TablePaginationConfig } from "antd";

type ColumnsType<T> = TableColumnsType<T>;

const { Text } = Typography;

// Page size
const count = 40;

// This is used in case we don't get overviewData
const defaultAmountOfMatches = 300;

const calculatePagination = (
  playerGroup: string,
  overviewData: StatsCurrentLiveGames | null | undefined,
) => {
  if (playerGroup == null || overviewData == null || !overviewData) {
    return defaultAmountOfMatches;
  }

  const games = overviewData.games;

  if (playerGroup === "1") {
    return games["1v1"] ?? count;
  } else if (playerGroup === "2") {
    return games["2v2"] ?? count;
  } else if (playerGroup === "3") {
    return games["3v3"] ?? count;
  } else if (playerGroup === "4") {
    return games["4v4"] ?? count;
  } else if (playerGroup === "5") {
    return games["AI"] ?? count;
  } else if (playerGroup === "0") {
    return games["custom"] ?? count;
  } else {
    return defaultAmountOfMatches;
  }
};

const LiveMatchesTable: React.FC<{
  changeRoute: (params: Record<string, string | number | undefined>) => void;
  currentLiveGamesData: StatsCurrentLiveGames | null;
  initialData: LiveGame[] | null;
  playerGroup: string;
  start: string;
  orderBy: string;
}> = ({ changeRoute, currentLiveGamesData, initialData, playerGroup, start, orderBy }) => {
  const overViewData = currentLiveGamesData;

  // Calculate initial pagination state from props
  const initialCurrent = Math.floor(parseInt(start) / count) + 1;
  const initialTotal = calculatePagination(playerGroup, overViewData);

  const [isLoading] = useState(false); // Start with false since we have initial data
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<{
    pagination: { current: number; pageSize: number; total: number; pageSizeOptions: ["40"] };
    data: Array<LiveGame> | null;
  }>({
    pagination: {
      current: initialCurrent === 0 ? 1 : initialCurrent,
      pageSize: count,
      total: initialTotal,
      pageSizeOptions: ["40"],
    },
    data: initialData, // Use initial data from server
  });

  // Update data when props change (server component re-renders with new data)
  useEffect(() => {
    const newCurrent = Math.floor(parseInt(start) / count) + 1;
    const newTotal = calculatePagination(playerGroup, overViewData);

    setData({
      pagination: {
        current: newCurrent === 0 ? 1 : newCurrent,
        pageSize: count,
        total: newTotal,
        pageSizeOptions: ["40"],
      },
      data: initialData,
    });
    setError(null);
  }, [initialData, playerGroup, start, orderBy, overViewData]);

  if (isDev()) {
    console.debug("re-render");
    console.debug(data);
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // Pagination is 1,2,3, but we need 0, 40, 80
    changeRoute({ startToLoad: ((pagination.current || 1) - 1) * count });
  };

  let content = <div></div>;

  // Handle null initial data (API error on server side)
  if (!initialData && !error && !isLoading) {
    content = (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"warning"}
          message={
            <>
              Could not load live matches data.
              <br /> Please try refreshing the page.
            </>
          }
          description={"The live games API may be temporarily unavailable."}
        />
      </Row>
    );
  } else if (error) {
    content = (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={
            <>
              There was an error loading the live matches.
              <br /> Please try again.
            </>
          }
          description={`${JSON.stringify(error)}`}
        />
      </Row>
    );
  }

  const dataSource = data.data || [];
  const displayRank = !(playerGroup === "5" || playerGroup === "0");

  const columns: ColumnsType<LiveGame> = [
    {
      title: <TeamOutlined />,
      key: "nmbOfPlayers",
      align: "center" as const,
      responsive: ["md"],
      render: (data: LiveGame) => {
        return `${data.players?.length}/${data.maxplayers}`;
      },
    },
    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
      responsive: ["md"],
      render: (matchtype_id: number) => {
        return formatMatchtypeID(matchtype_id);
      },
    },
    {
      title: `Axis Players ${displayRank ? "- with Rank" : ""}`,
      key: "axis_players",
      dataIndex: "players",
      render: (players: LiveGame["players"]) => {
        const axisPlayers = getMatchPlayersByFaction(players || [], "axis");

        return (
          <div>
            {axisPlayers.map((playerInfo: any) => {
              // WTF The rank is from 0 :D
              const rank = playerInfo?.rank === -1 ? "N/A" : playerInfo?.rank + 1;
              const raceName = raceIds[playerInfo?.race_id];

              return (
                <div key={playerInfo?.profile_id}>
                  {raceName && (
                    <NextImage
                      src={getGeneralIconImport(raceName, "small")}
                      height={20}
                      width={20}
                      alt={playerInfo?.race_id}
                    />
                  )}{" "}
                  {displayRank && (
                    <>
                      <Text strong>R</Text> {rank}{" "}
                    </>
                  )}
                  <Link
                    href={routes.playerCardWithId(
                      convertSteamNameToID(playerInfo?.player_profile?.name || ""),
                    )}
                    rel="nofollow noindex"
                    prefetch={false}
                  >
                    {playerInfo?.player_profile?.alias}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: `Allies Players ${displayRank ? "- with Rank" : ""}`,
      key: "allies_players",
      dataIndex: "players",
      render: (players: LiveGame["players"]) => {
        const alliesPlayers = getMatchPlayersByFaction(players || [], "allies");

        return (
          <div>
            {alliesPlayers.map((playerInfo: any) => {
              const rank = playerInfo?.rank === -1 ? "N/A" : playerInfo?.rank + 1;
              const raceName = raceIds[playerInfo?.race_id];

              return (
                <div key={playerInfo?.profile_id}>
                  {raceName && (
                    <NextImage
                      src={getGeneralIconImport(raceName, "small")}
                      height={20}
                      width={20}
                      alt={playerInfo?.race_id}
                    />
                  )}{" "}
                  {displayRank && (
                    <>
                      <Text strong>R</Text> {rank}{" "}
                    </>
                  )}
                  <Link
                    href={routes.playerCardWithId(
                      convertSteamNameToID(playerInfo?.player_profile?.name || ""),
                    )}
                    rel="nofollow noindex"
                    prefetch={false}
                  >
                    {playerInfo?.player_profile?.alias}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Map",
      dataIndex: "mapname",
      key: "mapname",
    },
    {
      title: "Observers",
      align: "center" as const,
      key: "observers",
      render: (data: LiveGame) => {
        return `${data.current_observers}`;
      },
    },
    {
      title: "Gametime",
      align: "center" as const,
      dataIndex: "startgametime",
      render: (data: number) => {
        return getMatchDuration(data, Date.now() / 1000);
      },
    },
  ];

  if (!error && (initialData || isLoading)) {
    content = (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.id}
        loading={isLoading}
        pagination={data.pagination}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    );
  }

  return <div>{content}</div>;
};

export default LiveMatchesTable;

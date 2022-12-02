import React, { useContext, useEffect, useState } from "react";
import { Row, Table, Typography } from "antd";
import { LiveGame, StatsCurrentLiveGames } from "../../coh/types";
import { getAPIUrl, isDev, useQuery } from "../../utils/helpers";
import { TeamOutlined } from "@ant-design/icons";
import firebaseAnalytics from "../../analytics";
import { AlertBox } from "../../components/alert-box";
import {
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  raceIds,
} from "../../utils/table-functions";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { ColumnsType } from "antd/es/table";
import { ConfigContext } from "../../config-context";

const { Text } = Typography;

// Page size
const count = 40;

const calculatePagination = (
  playerGroup: string,
  overviewData: StatsCurrentLiveGames | undefined,
) => {
  if (playerGroup == null || overviewData == null || !overviewData) {
    return count;
  }

  const games = overviewData.games;

  if (playerGroup === "1") {
    return games["1v1"] + count;
  } else if (playerGroup === "2") {
    return games["2v2"] + count;
  } else if (playerGroup === "3") {
    return games["3v3"] + count;
  } else if (playerGroup === "4") {
    return games["4v4"] + count;
  } else if (playerGroup === "5") {
    return games["AI"] + count;
  } else if (playerGroup === "0") {
    return games["custom"] + count;
  } else {
    return 500;
  }
};

const LiveMatchesTable: React.FC<{
  changeRoute: Function;
  currentLiveGamesData: StatsCurrentLiveGames | undefined;
}> = ({ changeRoute, currentLiveGamesData }) => {
  const query = useQuery();
  const { userConfig } = useContext(ConfigContext);

  const playerGroup = query.get("playerGroup") || "1";
  const startQuery = query.get("start") || "0";
  const orderByQuery = query.get("orderBy") || "0";

  const overViewData = currentLiveGamesData;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<{
    pagination: { current: number; pageSize: number; total: number; pageSizeOptions: ["40"] };
    data: Array<LiveGame> | null;
  }>({
    pagination: {
      current: 1,
      pageSize: count,
      total: count,
      pageSizeOptions: ["40"],
    },
    data: null,
  });

  // When our pagination data are loaded let's change it
  useEffect(() => {
    setData((prevState) => {
      return {
        data: prevState.data,
        pagination: {
          current: prevState.pagination.current,
          pageSize: count,
          total: calculatePagination(playerGroup, overViewData),
          pageSizeOptions: [`${count}`],
        },
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overViewData]);

  useEffect(() => {
    firebaseAnalytics.liveMatchesDisplayed();

    setIsLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `${getAPIUrl(
            userConfig,
          )}getLiveGamesHttp?playerGroup=${playerGroup}&start=${startQuery}&count=${count}&sortOrder=${orderByQuery}&apiKey=c2sXe4zguRtYMBY`,
        );
        if (!response.ok) {
          throw new Error(
            `COH2 Stats API request failed with code: ${
              response.status
            }, res: ${await response.text()}`,
          );
        }
        setError(null);

        const current = Math.floor(parseInt(startQuery) / count) + 1;

        const finalData = await response.json();

        setData((prevState) => {
          return {
            pagination: {
              current: current === 0 ? 1 : current,
              pageSize: count,
              // On the first render the second API call might finish sooner
              total:
                overViewData === undefined
                  ? prevState.pagination.total
                  : calculatePagination(playerGroup, overViewData),
              pageSizeOptions: [`${count}`],
            },
            data: finalData,
          };
        });
      } catch (e) {
        let errorMessage = "Failed to fetch the data.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.error(e);
        setError(JSON.stringify(errorMessage));
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerGroup, startQuery, orderByQuery]);

  if (isDev()) {
    console.debug("re-render");
    console.debug(data);
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Pagination is 1,2,3, but we need 0, 40, 80
    changeRoute({ startToLoad: (pagination.current - 1) * count });
  };

  let content = <div></div>;

  if (error) {
    content = (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={"There was an error loading the live matches"}
          description={`${JSON.stringify(error)}`}
        />
      </Row>
    );
  }

  const dataSource = data.data || [];
  const displayRank = !(playerGroup === "5" || playerGroup === "0");

  const columns: ColumnsType<any> = [
    {
      title: <TeamOutlined />,
      key: "nmbOfPlayers",
      align: "center" as "center",
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
      render: (data: Array<LiveGame["players"]>) => {
        let axisPlayers = getMatchPlayersByFaction(data, "axis");

        return (
          <div>
            {axisPlayers.map((playerInfo: Record<string, any>) => {
              // WTF The rank is from 0 :D
              const rank = playerInfo?.rank === -1 ? "N/A" : playerInfo?.rank + 1;

              return (
                <div key={playerInfo?.profile_id}>
                  <img
                    key={playerInfo?.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo?.race_id], "small")}
                    height="20px"
                    width="20px"
                    alt={playerInfo?.race_id}
                  />{" "}
                  {displayRank && (
                    <>
                      <Text strong>R</Text> {rank}{" "}
                    </>
                  )}
                  <Link
                    to={routes.playerCardWithId(
                      convertSteamNameToID(playerInfo?.player_profile?.name || ""),
                    )}
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
      render: (data: Array<LiveGame["players"]>) => {
        let alliesPlayers = getMatchPlayersByFaction(data, "allies");

        return (
          <div>
            {alliesPlayers.map((playerInfo: Record<string, any>) => {
              const rank = playerInfo?.rank === -1 ? "N/A" : playerInfo?.rank + 1;

              return (
                <div key={playerInfo?.profile_id}>
                  <img
                    key={playerInfo?.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo?.race_id], "small")}
                    height="20px"
                    width="20px"
                    alt={playerInfo?.race_id}
                  />{" "}
                  {displayRank && (
                    <>
                      <Text strong>R</Text> {rank}{" "}
                    </>
                  )}
                  <Link
                    to={routes.playerCardWithId(
                      convertSteamNameToID(playerInfo?.player_profile?.name || ""),
                    )}
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
      align: "center" as "center",
      key: "observers",
      render: (data: LiveGame) => {
        return `${data.current_observers}`;
      },
    },
    {
      title: "Gametime",
      align: "center" as "center",
      dataIndex: "startgametime",
      render: (data: number) => {
        return getMatchDuration(data, Date.now() / 1000);
      },
    },
  ];

  if (!error) {
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

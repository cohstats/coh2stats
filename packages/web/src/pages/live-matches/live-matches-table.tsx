import React, { useEffect, useState } from "react";
import { Row, Table } from "antd";
import { LiveGame } from "../../coh/types";
import { isDev, useQuery } from "../../utils/helpers";
import { TeamOutlined } from "@ant-design/icons";
import firebaseAnalytics from "../../analytics";
import config from "../../config";
import { Loading } from "../../components/loading";
import { AlertBox } from "../../components/alert-box";

const LiveMatchesTable: React.FC<{
  changeRoute: Function | null;
}> = ({ changeRoute }) => {
  const query = useQuery();

  const playerGroup = query.get("playerGroup") || "1";
  const startQuery = query.get("start") || "0";
  const orderByQuery = query.get("orderBy") || "0";
  const count = 40;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<{
    pagination: { current: number; pageSize: number; total: number; pageSizeOptions: ["40"] };
    data: Array<LiveGame> | null;
  }>({
    pagination: {
      current: 1,
      pageSize: 40,
      total: 40,
      pageSizeOptions: ["40"],
    },
    data: null,
  });

  useEffect(() => {
    firebaseAnalytics.liveMatchesDisplayed();

    setIsLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `https://${config.firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/getLiveGamesHttp?playerGroup=${playerGroup}&start=${startQuery}&count=${count}&sortOrder=${orderByQuery}`,
        );
        if (!response.ok) {
          throw new Error(
            `API request failed with code: ${response.status}, res: ${await response.text()}`,
          );
        }
        setError(null);

        const current = Math.ceil(parseInt(startQuery) / count);
        setData({
          pagination: {
            current: current === 0 ? 1 : current,
            pageSize: 40,
            total: 200,
            pageSizeOptions: ["40"],
          },
          data: await response.json(),
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
  }, [playerGroup, startQuery, orderByQuery]);

  if (isDev()) {
    console.log(data);
  }

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

  const columns = [
    {
      title: <TeamOutlined />,
      key: "nmbOfPlayers",
      align: "center" as "center",
      render: (data: LiveGame) => {
        return `${data.players?.length}/${data.maxplayers}`;
      },
    },
    {
      title: "Players",
      dataIndex: "players",
      key: "players",
      render: (data: Array<LiveGame["players"]>) => {
        const playerNames: Array<string> = [];
        data.forEach((playerProfile) => {
          // @ts-ignore
          playerNames.push(playerProfile?.player_profile?.alias);
        });
        return JSON.stringify(playerNames);
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
      render: (data: LiveGame) => {
        return `${data.current_observers}`;
      },
    },
    {
      title: "SLOUPECEK",
      align: "center" as "center",
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
      />
    );
  }

  return <div>{content}</div>;
};

export default LiveMatchesTable;

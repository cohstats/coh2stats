import React from "react";
import { Table } from "antd";
import { LiveGame } from "../../coh/types";
import { isDev } from "../../utils/helpers";
import { TeamOutlined } from "@ant-design/icons";

const LiveMatchesTable: React.FC<{
  data: Array<LiveGame> | null;
}> = ({ data }) => {
  if (!data) {
    data = [];
  }

  if (isDev()) {
    console.log(data);
  }

  const dataSource = data;

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
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record.id}
      pagination={{
        defaultPageSize: 40,
        pageSizeOptions: ["40", "100", "200"],
      }}
    />
  );
};

export default LiveMatchesTable;

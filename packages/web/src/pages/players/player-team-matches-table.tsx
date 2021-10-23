import React from "react";
import { ColumnsType } from "antd/lib/table";
import { LaddersDataArrayObject, PlayerCardDataArrayObject } from "../../coh/types";
import { CountryFlag } from "../../components/country-flag";
import { Table, Tooltip, Typography } from "antd";
import { timeAgo } from "../../utils/helpers";
import { convertSteamNameToID, levelToText } from "../../coh/helpers";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { convertTeamNames } from "./helpers";
import { Helper } from "../../components/helper";
const { Text } = Typography;

interface IProps {
  title: string;
  data: Array<PlayerCardDataArrayObject>;
}

const PlayerTeamMatchesTable: React.FC<IProps> = ({ title, data }) => {
  // Sort by total games
  const sortedData = data.sort((a, b) => {
    if (a.wins + a.losses > b.wins + b.losses) {
      return -1;
    } else {
      return 1;
    }
  });

  const TableColumns: ColumnsType<PlayerCardDataArrayObject> = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      align: "left" as "left",
      width: 180,
      render: (mode: string, data) => {
        return (
          <div>
            <Text strong>{convertTeamNames(mode)}</Text>
            {data["members"].map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id} style={{ paddingLeft: 10 }}>
                  <CountryFlag
                    countryCode={playerInfo["country"]}
                    style={{ width: "1.2em", height: "1.2em", paddingRight: 0 }}
                  />{" "}
                  <Link to={routes.playerCardWithId(convertSteamNameToID(playerInfo["name"]))}>
                    {playerInfo["alias"]}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 70,
      render: (data: any) => {
        if (data < 0) {
          return "-";
        } else {
          return data;
        }
      },
    },
    {
      title: (
        <>
          Level{" "}
          <Helper
            text={
              "Level 1 - 15 shows that you are better than bottom x% of players in the given leaderboard. Hover over the level to see the number." +
              " Level 16 - 20 are top 200 players."
            }
          />
        </>
      ),
      dataIndex: "ranklevel",
      key: "ranklevel",
      align: "center" as "center",
      width: 70,
      render: (data: any) => {
        if (data <= 0) {
          return "-";
        } else {
          return <Tooltip title={levelToText(data)}>{data}</Tooltip>;
        }
      },
    },
    {
      title: "Streak",
      dataIndex: "streak",
      key: "streak",
      align: "center" as "center",
      width: 70,
      render: (data: any) => {
        if (data > 0) {
          return <div style={{ color: "green" }}>+{data}</div>;
        } else {
          return <div style={{ color: "red" }}>{data}</div>;
        }
      },
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center" as "center",
      width: 70,
      render: (data: any) => {
        return <div>{Math.round(100 * Number(data.wins / (data.losses + data.wins)))}%</div>;
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center" as "center",
      width: 70,
      render: (data: any) => {
        return <>{data.wins + data.losses}</>;
      },
    },
    {
      title: "Drops",
      dataIndex: "drops",
      key: "drops",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Last Game",
      dataIndex: "lastmatchdate",
      key: "lastmatchdate",
      align: "right" as "right",
      width: 120,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) =>
        a.lastmatchdate - b.lastmatchdate,
      render: (data: any) => {
        if (data) {
          return (
            <Tooltip title={new Date(data * 1000).toLocaleString()}>
              {timeAgo.format(Date.now() - (Date.now() - data * 1000), "round-minute")}
            </Tooltip>
          );
        }
      },
    },
  ];

  return (
    <>
      <div style={{ fontSize: "large", paddingBottom: 4, paddingLeft: 4 }}>
        <Text strong>{title.toUpperCase()}</Text>{" "}
      </div>
      <Table
        style={{ paddingBottom: 20, overflow: "auto" }}
        columns={TableColumns}
        rowKey={(record) => `${record?.leaderboard_id}-${record?.statgroup_id}`}
        dataSource={sortedData}
        pagination={false}
        size={"small"}
      />
    </>
  );
};

export default PlayerTeamMatchesTable;

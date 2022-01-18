import { ColumnsType } from "antd/lib/table";
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { Table, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import React from "react";
import { LadderStats, Member, SideData } from "../../redux/state";
import { CountryFlag } from "./countryFlag";
import { timeAgo } from "../utils/helpers";
import { useState } from "react";
import { FactionIcon } from "./factionIcon";

interface Props {
  side: SideData
}

const TeamView: React.FC<Props> = ({side}) => {
  const [showTeams, setShowTeams] = useState(false);
  const showPlayerProfile = (steamId: string) => {
    window.electron.ipcRenderer.showProfile(steamId);
  }

  const TableColumns: ColumnsType<LadderStats> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 80,
      render: (rank: number) => {
        if (rank < 0) {
          return "-";
        } else {
          return rank;
        }
      }
    },
    {
      title: "Level",
      dataIndex: "ranklevel",
      key: "ranklevel",
      align: "center" as "center",
      responsive: ["lg"],
      width: 20,
      render: (level: number) => {
        if (level < 0) {
          return "-";
        } else {
          return level;
        }
      }
    },
    {
      title: "Alias",
      dataIndex: "members",
      key: "members",
      render: (members: Member[]) => {
        return (
          <div>
            {members.map(member => {
              return (
                <div key={member.relicID}>
                  <FactionIcon ai={member.ai} faction={member.faction} style={{ width: "1.2em", height: "1.2em" }} />
                  <CountryFlag countryCode={member.country} style={{ width: "1.2em", height: "1.2em", paddingRight: 0 }} />
                  {" "}
                  <a onClick={() => {
                    showPlayerProfile(member.steamID)
                  }}>{member.name}</a>
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      title: "Streak",
      key: "streak",
      align: "center" as "center",
      width: 80,
      responsive: ["sm"],
      //sorter: (a, b) => a.streak - b.streak,
      render: (data: LadderStats) => {
        if ((data.wins + data.losses) > 0) {
          if (data.streak > 0) {
            return <div style={{ color: "green" }}>+{data.streak}</div>;
          } else {
            return <div style={{ color: "red" }}>{data.streak}</div>;
          }
        } else {
          return "-";
        }
      },
    },
    {
      title: "Wins",
      key: "wins",
      align: "center" as "center",
      width: 20,
      responsive: ["md"],
      //sorter: (a, b) => a.wins - b.wins,
      render: (data: LadderStats) => {
        if ((data.wins + data.losses) > 0) {
          return data.wins;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Losses",
      key: "losses",
      align: "center" as "center",
      width: 20,
      responsive: ["md"],
      //sorter: (a, b) => a.losses - b.losses,
      render: (data: LadderStats) => {
        if ((data.wins + data.losses) > 0) {
          return data.losses;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center" as "center",
      width: 80,
      /*sorter: (a, b) => {
        return (
          Math.round(100 * Number(a.wins / (a.losses + a.wins))) -
          Math.round(100 * Number(b.wins / (b.losses + b.wins)))
        );
      },*/
      render: (data: LadderStats) => {
        if ((data.wins + data.losses) > 0) {
          return <div>{Math.round(100 * Number(data.wins / (data.losses + data.wins)))}%</div>;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center" as "center",
      width: 60,
      responsive: ["md"],
      /*sorter: (a, b) => {
        return a.wins + a.losses - (b.wins + b.losses);
      },*/
      render: (data: LadderStats) => {
        if ((data.wins + data.losses) > 0) {
          return <>{data.wins + data.losses}</>;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Drops",
      dataIndex: "drops",
      key: "drops",
      align: "center" as "center",
      width: 20,
      responsive: ["xl"],
      //sorter: (a, b) => a.drops - b.drops,
      render: (drops: number) => {
        if (drops < 0) {
          return "-";
        } else {
          return drops;
        }
      }
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as "center",
      responsive: ["xl"],
      //sorter: (a, b) => a.disputes - b.disputes,
      width: 20,
      render: (disputes: number) => {
        if (disputes < 0) {
          return "-";
        } else {
          return disputes;
        }
      }
    },
    {
      title: "Last Game",
      key: "lastmatchdate",
      align: "right" as "right",
      width: 110,
      responsive: ["sm"],
      /*sorter: (a, b) =>
        a.lastmatchdate - b.lastmatchdate,*/
      render: (data: LadderStats) => {
        if ((data.wins + data.losses)>0) {
          return (
            <Tooltip title={new Date(data.lastmatchdate * 1000).toLocaleString()}>
              {timeAgo.format(Date.now() - (Date.now() - data.lastmatchdate * 1000), "round-minute")}
            </Tooltip>
          );
        } else {
          return "-";
        }
      },
    },
  ];

  const footer = () => {
    if (side.teams.length > 0) {
      return (
        <>
          {!showTeams ? (
            <a onClick={() => setShowTeams(true)}><PlusSquareOutlined /> Show {side.teams.length} Team Rankings</a>
          ): (
            <a onClick={() => setShowTeams(false)}><MinusSquareOutlined /> Hide Team Rankings</a>
          )}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Table
        style={{ paddingBottom: 20, overflow: "auto" }}
        columns={TableColumns}
        dataSource={showTeams ? side.solo.concat(side.teams) : side.solo}
        rowKey={(record) => record.members.map(member => member.relicID + "" + member.faction + "" + member.name).join("")}
        pagination={false}
        size={"small"}
        footer={footer}
      />
    </div>
  );
}

export default TeamView;

/*
export interface LadderStats {
  members: Member[];
  wins: number;
  losses: number;
  streak: number;
  disputes: number;
  drops: number;
  rank: number;
  ranktotal: number;
  ranklevel: number;
  regionrank: number;
  regionranktotal: number;
  lastmatchdate: number;
}
*/

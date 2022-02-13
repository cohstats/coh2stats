import { ColumnsType } from "antd/lib/table";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import Tooltip from "antd/lib/tooltip/index";
import Table from "antd/lib/table/Table";
import Typography from "antd/lib/typography";
import React, { useState } from "react";
import { LadderStats, Member, SideData } from "../../redux/state";
import { CountryFlag } from "./country-flag";
import { timeAgo } from "../utils/helpers";
import { FactionIcon } from "./faction-icon";
import { Helper } from "@coh2ladders/shared/src/components/helper";
import { levelToText } from "@coh2ladders/shared/src/coh/helpers";

interface Props {
  side: SideData;
}

const TeamView: React.FC<Props> = ({ side }) => {
  const [showTeams, setShowTeams] = useState(false);
  const showPlayerProfile = (steamId: string) => {
    window.electron.ipcRenderer.showProfile(steamId);
  };
  const TableColumns: ColumnsType<LadderStats> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as const,
      width: 80,
      render: (rank: number) => {
        if (rank < 0) {
          return "-";
        } else {
          return rank;
        }
      },
    },
    {
      title: "T Rank",
      dataIndex: "teamrank",
      key: "teamrank",
      align: "center" as const,
      width: 80,
      render: (teamrank: number) => {
        if (!teamrank) {
          return "";
        } else {
          if (teamrank < 0) {
            return "-";
          }
          return teamrank;
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
      align: "center" as const,
      responsive: ["sm"],
      width: 80,
      render: (level: number) => {
        if (level <= 0) {
          return "-";
        } else {
          return <Tooltip title={levelToText(level)}>{level}</Tooltip>;
        }
      },
    },
    {
      title: "Alias",
      dataIndex: "members",
      key: "members",
      render: (members: Member[]) => {
        return (
          <div>
            {members.map((member) => {
              return (
                <div key={member.relicID}>
                  <FactionIcon
                    ai={member.ai}
                    faction={member.faction}
                    style={{ width: "1.2em", height: "1.2em", marginRight: 4 }}
                  />
                  <CountryFlag
                    countryCode={member.country}
                    style={{ width: "1.2em", height: "1.2em", paddingRight: 0, marginRight: 4 }}
                  />
                  <Typography.Link
                    onClick={() => {
                      showPlayerProfile(member.steamID);
                    }}
                  >
                    {member.name}
                  </Typography.Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Streak",
      key: "streak",
      align: "center" as const,
      width: 80,
      responsive: ["md"],
      //sorter: (a, b) => a.streak - b.streak,
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
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
      align: "center" as const,
      width: 20,
      responsive: ["lg"],
      //sorter: (a, b) => a.wins - b.wins,
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
          return data.wins;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Losses",
      key: "losses",
      align: "center" as const,
      width: 20,
      responsive: ["lg"],
      //sorter: (a, b) => a.losses - b.losses,
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
          return data.losses;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center" as const,
      width: 80,
      /*sorter: (a, b) => {
        return (
          Math.round(100 * Number(a.wins / (a.losses + a.wins))) -
          Math.round(100 * Number(b.wins / (b.losses + b.wins)))
        );
      },*/
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
          return <div>{Math.round(100 * Number(data.wins / (data.losses + data.wins)))}%</div>;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center" as const,
      width: 60,
      responsive: ["lg"],
      /*sorter: (a, b) => {
        return a.wins + a.losses - (b.wins + b.losses);
      },*/
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
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
      align: "center" as const,
      width: 20,
      responsive: ["xl"],
      //sorter: (a, b) => a.drops - b.drops,
      render: (drops: number) => {
        if (drops < 0) {
          return "-";
        } else {
          return drops;
        }
      },
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as const,
      responsive: ["xl"],
      //sorter: (a, b) => a.disputes - b.disputes,
      width: 20,
      render: (disputes: number) => {
        if (disputes < 0) {
          return "-";
        } else {
          return disputes;
        }
      },
    },
    {
      title: "Last Game",
      key: "lastmatchdate",
      align: "right" as const,
      width: 120,
      responsive: ["md"],
      /*sorter: (a, b) =>
        a.lastmatchdate - b.lastmatchdate,*/
      render: (data: LadderStats) => {
        if (data.wins + data.losses > 0) {
          return (
            <Tooltip title={new Date(data.lastmatchdate * 1000).toLocaleString()}>
              {timeAgo.format(
                Date.now() - (Date.now() - data.lastmatchdate * 1000),
                "round-minute",
              )}
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
            <Typography.Link onClick={() => setShowTeams(true)}>
              <PlusSquareOutlined /> Show {side.teams.length} Team Rankings
            </Typography.Link>
          ) : (
            <Typography.Link onClick={() => setShowTeams(false)}>
              <MinusSquareOutlined /> Hide Team Rankings
            </Typography.Link>
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
        rowKey={(record) =>
          record.members
            .map((member) => member.relicID + "" + member.faction + "" + member.name)
            .join("")
        }
        pagination={false}
        size={"small"}
        footer={footer}
      />
    </div>
  );
};

export default TeamView;

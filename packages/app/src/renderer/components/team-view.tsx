import { ColumnsType } from "antd/es/table";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip/index";
import Table from "antd/es/table/Table";
import Typography from "antd/es/typography";
import React, { useEffect, useState } from "react";
import { LadderStats, Member, SideData } from "../../redux/state";
import { CountryFlag } from "./country-flag";
import { timeAgo } from "../utils/helpers";
import { FactionIcon } from "./faction-icon";
import { Helper } from "@coh2stats/shared/src/components/helper";
import { levelToText } from "@coh2stats/shared/src/coh/helpers";
import { calculateOverallStatsForPlayerCard } from "@coh2stats/web/src/pages/players/data-processing";
import config from "../../../../web/src/config";
const { Text } = Typography;
interface Props {
  side: SideData;
}
type playerCardAPIObject = {
  relicPersonalStats: Record<string, any>;
  steamProfile: Record<string, any>;
  playerMatches: Array<Record<string, any>>;
  playTime: null | number;
};



const TeamView: React.FC<Props> = ({ side }) => {
  const [showTeams, setShowTeams] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [steamid, setSteamid] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [totalGames, setTotalGames] = useState<any>();
  const [lastGameDate, setLastGameDate] = useState<any>();
  const [bestRank, setBestRank] = useState<any>();
  const [mostPlayed, setMostPlayed] = useState<any>();
  const [totalWinRate, setTotalWinRate] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if(steamid !== 0){
        try {
          const response = await fetch(
            `https://${config.firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/getPlayerCardEverythingHttp?steamid=${steamid}`,
          );
          const finalData: playerCardAPIObject = await response.json();
          const relicData = finalData.relicPersonalStats;
          const { totalGames, lastGameDate, bestRank, mostPlayed, totalWinRate } =
          calculateOverallStatsForPlayerCard(relicData.leaderboardStats);
          setTotalGames(totalGames)
          setLastGameDate(lastGameDate)
          setBestRank(bestRank)
          setMostPlayed(mostPlayed)
          setTotalWinRate(totalWinRate)
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
      })();
    
  }, [steamid]);

  const showPlayerProfile = (steamId: string) => {
    window.electron.ipcRenderer.showProfile(steamId);
  };

  const convertTeamNames = (mode: string) => {
    if (mode.startsWith("team")) {
      return `Team of ${mode[4]}`;
    } else {
      return mode;
    }
  };

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
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
        if (data.wins + data.losses > 0 && data.lastmatchdate) {
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
        expandedRowKeys={expandedRowKeys}
        expandable={{
          expandedRowRender: record => {
              return <>
                {
                  isLoading
                  ?<></>
                  : <div style={{ float: "right", textAlign: "right" }}> <div>
                  {bestRank.rank !== Infinity ? (
                    <>
                      Current best rank <Text strong>{bestRank.rank}</Text> in{" "}
                      <Text strong>
                        {convertTeamNames(bestRank.mode)} as {capitalize(bestRank.race)}
                      </Text>
                    </>
                  ) : (
                    <>
                      Currently <Text strong>unranked</Text>
                    </>
                  )}
                </div>
                <div>
                  Most played{" "}
                  <Text strong>
                    {convertTeamNames(mostPlayed.mode)} as {capitalize(mostPlayed.race)}
                  </Text>
                </div>
                <div>
                  <Text strong>{totalGames} ranked games</Text>
                </div>
                <div>
                  <Text strong>{(totalWinRate * 100).toFixed(0)}% ranked winrate</Text>
                </div>
                <br />
                <div>
                  <Tooltip title={new Date(lastGameDate * 1000).toLocaleString()}>
                    Last match{" "}
                    {timeAgo.format(Date.now() - (Date.now() - lastGameDate * 1000), "round-minute")}
                  </Tooltip>
                </div>
              </div>
                }
          </>
       
        },
          onExpand: (expanded, record) => {
            var keys = [];
		        if(expanded){
			        keys.push( record.members[0].relicID + "" +  record.members[0].faction + "" +  record.members[0].name);
		        }
            setExpandedRowKeys(keys);
            setSteamid(record.members[0].steamID as any)},
          rowExpandable: record => record.members.length === 1,
         
        }}
    
      />
    </div>
  );
};

export default TeamView;

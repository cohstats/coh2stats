import React, { useCallback, useEffect } from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  getRaceImage,
  raceIds,
  ExpandedMatch,
  isMobileMediaQuery,
  getPlayerMapListFilter,
} from "../../utils/table-functions";
import "./tableStyle.css";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { BulbOutlined, DatabaseOutlined } from "@ant-design/icons";
import { RelicIcon } from "../../components/relic-icon";
import { useMediaQuery } from "react-responsive";
import firebaseAnalytics from "../../analytics";

interface IProps {
  data: Array<Record<string, any>>;
  profileID: string; // has to be in format "/steam/{steamID}"
}

const LastMatchesTable: React.FC<IProps> = ({ data, profileID }) => {
  const isMobile = useMediaQuery({ query: isMobileMediaQuery });

  useEffect(() => {
    firebaseAnalytics.playerCardMatchesDisplayed();
  }, []);

  let localLoadedMatches = data
    .filter(
      (match) =>
        match.description !== "SESSION_MATCH_KEY" && match.matchhistoryreportresults.length !== 0,
    )
    .sort((a: any, b: any) => b.completiontime - a.completiontime);

  // set state variable for map filter options
  const playerMaps = getPlayerMapListFilter(localLoadedMatches) || {
    text: "8p_redball_express",
    value: "8p_redball_express",
  };

  let matchRecords = localLoadedMatches;

  function isPlayerVictorious(matchRecord: any): boolean {
    if (!matchRecord) return false;

    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name === profileID,
    );
    return resultItem[0]?.resulttype === 1;
  }

  function getPlayerMatchHistoryResult(matchRecord: any) {
    let player = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name === profileID,
    );
    return player[0];
  }

  const renderExpandedMatch = useCallback((record: any) => {
    return <ExpandedMatch record={record} />;
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "Played",
      dataIndex: "id",
      key: "id",
      align: "center" as "center",
      sorter: (a, b) => a.completiontime - b.completiontime,
      render: (_text: any, record: any) => {
        let player = getPlayerMatchHistoryResult(record);
        return (
          <>
            <div>
              <Tooltip title={player?.profile?.alias} key={player?.profile?.alias}>
                <img
                  key={player?.profile_id}
                  src={getRaceImage(raceIds[player?.race_id])}
                  height="48px"
                  width="48px"
                  alt={player?.race_id}
                />
              </Tooltip>
            </div>
            <div>
              <sub> {formatMatchTime(record.completiontime)} </sub>
            </div>
          </>
        );
      },
    },
    {
      title: "Result",
      dataIndex: "matchhistoryreportresults",
      key: "result",
      align: "center" as "center",
      responsive: ["xl"],
      render: (data: any, record: any) => {
        if (isPlayerVictorious(record)) {
          return <Tag color={"#108ee9"}>VICTORY</Tag>;
        } else {
          return <Tag color={"#f50"}>DEFEAT</Tag>;
        }
      },
    },
    {
      title: "Axis Players",
      key: "axis_players",
      dataIndex: "matchhistoryreportresults",
      render: (data: any, record: any) => {
        let axisPlayers = getMatchPlayersByFaction(data, "axis");
        return (
          <div>
            {axisPlayers.map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id}>
                  <img
                    key={playerInfo.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo.race_id], "small")}
                    height="20px"
                    alt={playerInfo.race_id}
                  />{" "}
                  <Link
                    to={routes.playerCardWithId(convertSteamNameToID(playerInfo.profile["name"]))}
                  >
                    {playerInfo.profile.name === profileID ? (
                      <b>{playerInfo.profile["alias"]}</b>
                    ) : (
                      playerInfo.profile["alias"]
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Allies Players",
      key: "allies_players",
      dataIndex: "matchhistoryreportresults",
      render: (data: any, record: any) => {
        let alliesPlayers = getMatchPlayersByFaction(data, "allies");
        return (
          <div>
            {alliesPlayers.map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id}>
                  <img
                    key={playerInfo.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo.race_id], "small")}
                    height="20px"
                    alt={playerInfo.race_id}
                  />{" "}
                  <Link
                    to={routes.playerCardWithId(convertSteamNameToID(playerInfo.profile["name"]))}
                  >
                    {playerInfo.profile.name === profileID ? (
                      <b>{playerInfo.profile["alias"]}</b>
                    ) : (
                      playerInfo.profile["alias"]
                    )}
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
      filters: playerMaps,
      align: "left" as "left",
      onFilter: (value: any, record: any) => record.mapname === value,
      responsive: ["lg"],
    },
    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
      align: "center" as "center",
      responsive: ["xl"],
      filters: [
        {
          text: "1 vs 1",
          value: 1,
        },
        {
          text: "2 vs 2",
          value: 2,
        },
        {
          text: "3 vs 3",
          value: 3,
        },
        {
          text: "4 vs 4",
          value: 4,
        },
      ],
      onFilter: (value: any, record: any) => record.matchtype_id === value,
      render: (_text: any, record: any) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <div>{formatMatchtypeID(record.matchtype_id)}</div>
              <sub> {record.description.toLowerCase()} </sub>
            </div>
          </>
        );
      },
    },
    {
      title: "Match duration",
      dataIndex: "matchduration",
      key: "matchduration",
      align: "center" as "center",
      responsive: ["xl"],
      sorter: (a: any, b: any) =>
        a.completiontime - a.startgametime - (b.completiontime - b.startgametime),
      render: (_text: any, record: any) => {
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },
    Table.EXPAND_COLUMN,
  ];

  return (
    <>
      <div>
        <div style={{ float: "left" }}>
          <BulbOutlined /> Click on the row to show more details.
        </div>
        <div style={{ float: "right" }}>
          <Tooltip
            title={
              "The results are also time bounded. If the match is too old Relic deletes it even " +
              "when you have less then 10 matches in that mode."
            }
          >
            <BulbOutlined /> Relic keeps only last 10 matches for each mode
          </Tooltip>{" "}
          <Tooltip
            title={
              "This is realtime data from the game. It should be the same as you see in your recent games in game."
            }
          >
            <DatabaseOutlined /> Data source <RelicIcon />
          </Tooltip>
        </div>
      </div>
      <Table
        style={{ paddingTop: 5, overflow: "auto" }}
        pagination={false}
        columns={columns}
        dataSource={matchRecords}
        rowKey={(record) => record.id}
        size="middle"
        rowClassName={(record) => (isPlayerVictorious(record) ? "green" : "red")}
        expandable={{
          expandedRowRender: renderExpandedMatch,
          rowExpandable: (_) => !isMobile,
          expandRowByClick: true,
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={columns.length} align={"left"}>
                Total amount of matches {matchRecords.length}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </>
  );
};

export default LastMatchesTable;

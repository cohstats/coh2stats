import React, { useContext, useEffect, useState } from "react";
import { Image, Row, Table, Tag, Tooltip } from "antd";
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
import { getMapIconPath } from "../../coh/maps";
import { ConfigContext } from "../../config-context";
import { getAPIUrl } from "../../utils/helpers";
import { Space } from "antd/es";
import { AlertBox } from "../../components/alert-box";
import { AlertBoxChina } from "../../components/alert-box-china";

interface IProps {
  steamID: string;
}

const renderExpandedMatch = (record: any) => {
  return <ExpandedMatch record={record} />;
};

const LastMatchesTable: React.FC<IProps> = ({ steamID }) => {
  const isMobile = useMediaQuery({ query: isMobileMediaQuery });

  const { userConfig } = useContext(ConfigContext);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<undefined | Array<Record<string, any>>>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    firebaseAnalytics.playerCardMatchesDisplayed();

    (async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${getAPIUrl(userConfig)}getPlayerMatchesRelicHttp?steamid=${steamID}`,
          {},
        );
        if (!response.ok) {
          throw new Error(
            `API request failed with code: ${response.status}, res: ${await response.text()}`,
          );
        }
        const finalData = await response.json();
        // Filter out incorrect data
        const matchData = finalData.playerMatches
          .filter(
            (match: any) =>
              match.description !== "SESSION_MATCH_KEY" &&
              match.matchhistoryreportresults.length !== 0,
          )
          .sort((a: any, b: any) => b.completiontime - a.completiontime);

        setData(matchData);
      } catch (e) {
        console.error(e);
        setError(JSON.stringify(e));
        // antd table takes undefined, not null
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [steamID, userConfig]);

  if (error) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Space direction={"vertical"}>
          <AlertBox
            type={"error"}
            message={"There was an error loading the player matches. Try refreshing the page."}
            description={`${JSON.stringify(error)}`}
          />
          <AlertBoxChina />
        </Space>
      </Row>
    );
  }

  const profileID = `/steam/${steamID}`;

  // set state variable for map filter options
  const playerMaps = getPlayerMapListFilter(data);

  let matchRecords = data;
  console.log("DATA" + data);

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
      render: (text: any, record: any) => {
        return (
          <>
            <Image
              src={getMapIconPath(record.mapname, "x64")}
              height={40}
              width={40}
              style={{ borderRadius: 4 }}
              alt={record.mapname}
              preview={false}
              fallback="data:image/png;base64,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"
            />{" "}
            {record.mapname}
          </>
        );
      },
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
        loading={isLoading}
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
                Total amount of matches {matchRecords?.length}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </>
  );
};

export default LastMatchesTable;

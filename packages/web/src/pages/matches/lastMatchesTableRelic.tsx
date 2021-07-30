import { Col, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  formatMapName,
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  getMatchResult,
  getRaceImage,
  raceIds,
  getAliasFromSteamID,
} from "./tableFunctions";
import "./tableStyle.css";
import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { BulbOutlined, DatabaseOutlined } from "@ant-design/icons";
import { RelicIcon } from "../../components/relic-icon";
import firebaseAnalytics from "../../analytics";

const { Text } = Typography;

const LastMatchesTableRelic: React.FC = () => {
  const { steamid } = useParams<{
    steamid: string;
  }>();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMatches, setLoadedMatches] = useState([]);
  const [profileID, setProfileID] = useState("/steam/" + steamid);
  const [playerAlias, setPlayerAlias] = useState("unknown player alias");

  const [playerMaps, setPlayerMaps] = useState([
    {
      text: "8p_redball_express",
      value: "8p_redball_express",
    },
  ]);

  // returns a filter setting for player maps
  function getPlayerMapListFilter(matches: any) {
    let mapSet = new Set();
    let filterSettings: any[] = [];
    for (let index in matches) {
      mapSet.add(matches[index].mapname);
    }

    // sort maps alphabetically
    let sortedMapsArray = Array.from(mapSet).sort((a: any, b: any) => {
      return a.localeCompare(b);
    });

    // create filter style
    for (let index in sortedMapsArray) {
      filterSettings[index] = {
        text: formatMapName(sortedMapsArray[index]),
        value: sortedMapsArray[index],
      };
    }
    return filterSettings;
  }

  useEffect(() => {
    firebaseAnalytics.playerCardDisplayed();

    // FYI this is special trick, anonymous function which is directly called - we need cos of compiler
    (async () => {
      // prepare the payload - you can modify the ID but it has to be in this format
      const payLoad = { profileName: "/steam/" + steamid };
      setProfileID(payLoad["profileName"]);
      // prepare the CF
      const getMatchesFromRelic = firebase.functions().httpsCallable("getPlayerMatchesFromRelic");

      try {
        // call the CF
        const matches = await getMatchesFromRelic(payLoad);

        // filter out invalid data provided by relic, and sort it descending with game start
        let localLoadedMatches = matches.data["playerMatches"]
          .filter(
            (match: any) =>
              match.description != "SESSION_MATCH_KEY" &&
              match.matchtype_id != 7 &&
              match.matchhistoryreportresults.length != 0,
          )
          .sort((a: any, b: any) => b.completiontime - a.completiontime);

        // set state variable loaded matches
        setLoadedMatches(localLoadedMatches);
        // set state variable for map filter options
        setPlayerMaps(getPlayerMapListFilter(localLoadedMatches));
        // set play alias
        let localAlias = getAliasFromSteamID(localLoadedMatches[0], steamid);
        setPlayerAlias(localAlias);

        setIsLoading(false);
      } catch (e) {
        debugger;
        setError(JSON.stringify(e));
      }
    })();
  }, [steamid]);

  let matchRecords = loadedMatches;

  function isPlayerVictorious(matchRecord: any): boolean {
    if (!matchRecord) return false;

    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name == profileID,
    );
    return resultItem[0].resulttype == 1;
  }

  function getPlayerMatchHistoryResult(matchRecord: any) {
    let player = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name == profileID,
    );
    return player[0];
  }

  function renderExpandedMatch(record: any) {
    if (!record) {
      return <></>;
    }
    let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "axis");
    let Axis = axisPlayers.map((player) => {
      return (
        <div key={player.profile_id} style={{ fontSize: 16, margin: "5px" }}>
          <Space>
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="32px"
              alt={player.race_id}
            />
            <Link
              key={player.profile_id + "link"}
              to={routes.playerCardWithId(convertSteamNameToID(player.profile["name"]))}
            >
              {player.profile.alias}{" "}
            </Link>
          </Space>
        </div>
      );
    });

    let alliesPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "allies");
    let allies = alliesPlayers.map((player) => {
      return (
        <div key={player.profile_id} style={{ fontSize: 16, margin: "5px" }}>
          <Space>
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="32px"
              alt={player.race_id}
            />
            <Link
              key={player.profile_id + "link"}
              to={routes.playerCardWithId(convertSteamNameToID(player.profile["name"]))}
            >
              {player.profile.alias}{" "}
            </Link>
          </Space>
        </div>
      );
    });

    return (
      <div>
        <Row justify="end" key={1}>
          <Col span={7} />
          <Col span={4}>{Axis}</Col>
          <Col span={2} />
          <Col span={4}>{allies}</Col>
          <Col span={7} />
          <Col />
        </Row>
        <Row justify="center">
          <Text disabled>
            TBD Additional match info
            <br />
            <b>View match details</b>
          </Text>
        </Row>
      </div>
    );
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
              <Tooltip title={player.profile.alias} key={player.profile.alias}>
                <img
                  key={player.profile_id}
                  src={getRaceImage(raceIds[player.race_id])}
                  height="48px"
                  alt={player.race_id}
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
      dataIndex: "matchhistoryreportresults",
      responsive: ["xl"],
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
                    {playerInfo.profile["alias"] === playerAlias ? (
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
      dataIndex: "matchhistoryreportresults",
      responsive: ["xl"],
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
                    {playerInfo.profile["alias"] === playerAlias ? (
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
      onFilter: (value: any, record: any) => record.mapname == value,
      responsive: ["lg"],
    },
    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
      align: "center" as "center",
      filters: [
        {
          text: "1 vs 1",
          value: "1",
        },
        {
          text: "2 vs 2",
          value: "2",
        },
        {
          text: "3 vs 3",
          value: "3",
        },
        {
          text: "4 vs 4",
          value: "4",
        },
      ],
      onFilter: (value: any, record: any) => record.matchtype_id == value,
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
      sorter: (a: any, b: any) =>
        a.completiontime - a.startgametime - (b.completiontime - b.startgametime),
      render: (_text: any, record: any) => {
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <>
        <div>
          <div style={{ float: "left" }}>
            <Tooltip
              title={
                "The results are also time bounded. If the match is too old Relic deletes it even " +
                "when you have less then 10 matches in that mode."
              }
            >
              <BulbOutlined /> Relic keeps only last 10 matches for each mode.
            </Tooltip>
          </div>
          <div style={{ float: "right" }}>
            <Tooltip
              title={"In future we might might allow access to matches stored at coh2stats.com"}
            >
              <DatabaseOutlined /> Data source <RelicIcon />
            </Tooltip>
          </div>
        </div>
        <Table
          style={{ paddingTop: 5 }}
          pagination={{
            defaultPageSize: 60,
            pageSizeOptions: ["10", "20", "40", "60", "100", "200"],
          }}
          columns={columns}
          dataSource={matchRecords}
          rowKey={(record) => record.id}
          size="middle"
          rowClassName={(record) => (isPlayerVictorious(record) ? "green" : "red")}
          expandable={{
            expandedRowRender: (record) => renderExpandedMatch(record),
            rowExpandable: (record) => true,
            expandRowByClick: true,
            expandIconColumnIndex: -1,
            expandedRowClassName: (record) =>
              isPlayerVictorious(record) ? "lightgreen" : "lightred",
          }}
          loading={isLoading}
        />
      </>
    );
  }
};

export default LastMatchesTableRelic;

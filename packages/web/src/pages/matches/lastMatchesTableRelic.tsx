import { Col, Divider, Row, Space, Table, Tooltip } from "antd";
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
} from "./tableFunctions";
import "./tableStyle.css";
import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import { useParams } from "react-router";

const LastMatchesTableRelic: React.FC = () => {
  // the componet can be in 3 states
  // error - something went wrong
  // loading -- we are still loading the data
  // loaded -- we have the date in the matches

  const { steamid } = useParams<{
    steamid: string;
  }>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedMatches, setLoadedMatches] = useState([]);
  const [profileID, setProfileID] = useState("/steam/"+steamid);
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
    // FYI this is special trick, anonymous function which is directly called - we need cos of compiler
    (async () => {
      // prepare the payload - you can modify the ID but it has to be in this format
      const payLoad = { profileName: "/steam/"+steamid };
      setProfileID(payLoad["profileName"]);
      // prepare the CF
      const getMatchesFromRelic = firebase.functions().httpsCallable("getPlayerMatchesFromRelic");

      try {
        // call the CF
        const matches = await getMatchesFromRelic(payLoad);
        // we have the data let's save it into the state
        console.log(matches.data["playerMatches"]);

        setPlayerMaps(getPlayerMapListFilter(matches.data["playerMatches"]));

        // filter out invalid data provided by relic, and sort it descending with game start
        setLoadedMatches(
          matches.data["playerMatches"]
            .filter(
              (match: any) => match.description != "SESSION_MATCH_KEY" && match.matchtype_id != 7,
            )
            .sort((a: any, b: any) => b.startgametime - a.startgametime),
        );
        console.log(matches)
        let localAlias = getAliasFromSteamID(loadedMatches[0]);
        setPlayerAlias(localAlias);


        setIsLoaded(true);

      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  let matchRecords = loadedMatches;

  function isPlayerVictorious(matchRecord: any): boolean {
    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name == profileID,
    );
    if (resultItem[0].resulttype == 1) {
      return true;
    } else {
      return false;
    }
  }

  function getPlayerMatchHistoryResult(matchRecord: any) {
    let player = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name == profileID,
    );
    return player[0];
  }

  function renderExpandedMatch(record: any) {
    let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "axis");
    let Axis = axisPlayers.map((player) => {
      return (
        <Col span={6}>
          <Space>
         <div style={{ fontSize: 16 }}>
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="32px"
              alt={player.race_id}
            />
            {player.profile.alias}
          </div>
          </Space>
        </Col>
      );
    });

    let alliesPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "allies");
    let allies = alliesPlayers.map((player) => {
      return (
        <Col span={6}>
          <Space>
          <div style={{ fontSize: 16 }}>
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="32px"
              alt={player.race_id}
            />
            {player.profile.alias}
          </div>
          </Space>
        </Col>
      );
    });

    return (
      <div>
        <Row>
          {Axis}
        </Row>
        <Divider></Divider>
        <Row>
          {allies}
        </Row>
      </div>
    );
  }

  /**
   * Returns string in format playerAllias, COUNTRY
   * @param steamId is steamID in relic api call format, example "/steam/76561198034318060"
   * @param matchRecord is a single record from array returned by relic api
   */
  function getAliasFromSteamID( matchRecord: any) {
    
    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name == profileID,
    );
  console.log(matchRecord)
   return resultItem[0].profile.name;
  }

  const columns: ColumnsType<any> = [
    {
      title: "Match ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.startgametime - b.startgametime,
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
              <sub> {formatMatchTime(record.startgametime)} </sub>
            </div>
          </>
        );
      },
    },

    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
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
      title: "Map",
      dataIndex: "mapname",
      key: "mapname",
      filters: playerMaps,
      onFilter: (value: any, record: any) => record.mapname == value,
      responsive: ["lg"],
      render: (_text: any, record: any) => {
        return <p> {record.mapname} </p>;
      },
    },

    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (_text: any, record: any) => {
        return (
          <div style={{ textAlign: "center" }}>
            {getMatchResult(record.matchhistoryreportresults)}
          </div>
        );
      },
    },

    {
      title: "Match duration",
      dataIndex: "matchduration",
      key: "matchduration",
      render: (_text: any, record: any) => {
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },

    {
      title: "Axis Players",

      responsive: ["xl"],
      render: (_text: any, record: any) => {
        let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "axis");

        let Images = axisPlayers.map((player) => {
          return (
            <Tooltip title={player.profile.alias} key={player.profile.alias}>
              <img
                key={player.profile_id}
                src={getRaceImage(raceIds[player.race_id])}
                height="48px"
                alt={player.race_id}
              />
            </Tooltip>
          );
        });
        return <Space>{Images}</Space>;
      },
    },

    {
      title: "Allies Players",

      responsive: ["xl"],
      render: (_text: any, record: any) => {
        let alliesPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "allies");

        let Images = alliesPlayers.map((player) => {
          return (
            <Tooltip title={player.profile.alias} key={player.profile.alias}>
              <img
                key={player.profile_id}
                src={getRaceImage(raceIds[player.race_id])}
                height="48px"
                alt={player.race_id}
              />
            </Tooltip>
          );
        });
        return <Space>{Images}</Space>;
      },
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <h1> Recent matches for player {playerAlias} </h1>
          </Col>
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Table
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
              }}
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </>
    );
  }
};

export default LastMatchesTableRelic;

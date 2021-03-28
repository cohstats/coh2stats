import { Col, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
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

const LastMatchesTableRelic: React.FC = () => {
  // the componet can be in 3 states
  // error - something went wrong
  // loading -- we are still loading the data
  // loaded -- we have the date in the matches

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [profileID, setProfileID] = useState("/steam/76561198034318060");
  const [playerAlias, setPlayerAlias] = useState("unknown player alias");

  useEffect(() => {
    // FYI this is special trick, anonymous function which is directly called - we need cos of compiler
    (async () => {
      // prepare the payload - you can modify the ID but it has to be in this format
      const payLoad = { profileName: "/steam/76561198034318060" };
      setProfileID(payLoad["profileName"]);
      // prepare the CF
      const getMatchesFromRelic = firebase.functions().httpsCallable("getPlayerMatchesFromRelic");

      try {
        // call the CF
        const matches = await getMatchesFromRelic(payLoad);
        // we have the data let's save it into the state
        console.log(matches.data["playerMatches"]);

        setIsLoaded(true);
        // filter out invalid data provided by relic, and sort it descending with game start
        setMatches(matches.data["playerMatches"].filter((match: any) => (match.description != "SESSION_MATCH_KEY") && (match.matchtype_id != 7)).sort((a: any, b: any) => b.startgametime - a.startgametime));
        setPlayerAlias(getAliasFromSteamID(profileID, matches.data["playerMatches"][0]));
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  let matchRecords = matches;


  function isPlayerVictorious(matchRecord: any): boolean {

    let resultItem = matchRecord.matchhistoryreportresults.filter((result: any) => (result.profile.name == profileID));
    console.log(resultItem[0])
    if (resultItem[0].resulttype == 1) {
      console.log("victory")
      return true
    }
    else {
      console.log("defeat")
      return false
    }
  }


  /**
   * Returns string in format playerAllias, COUNTRY
   * @param steamId is steamID in relic api call format, example "/steam/76561198034318060"
   * @param matchRecord is a single record from array returned by relic api
   */
  function getAliasFromSteamID(steamId: string, matchRecord: any) {
    let alias = "unknown";
    let profileId = 0;
    console.log("SEARCHING " + steamId);
    for (let index in matchRecord.steam_ids) {
      if (steamId.includes(matchRecord.steam_ids[index])) {
        profileId = matchRecord.profile_ids[index];
        console.log("FOUND " + profileId);
        for (let temp in matchRecord.matchhistoryreportresults) {
          if ((matchRecord.matchhistoryreportresults[temp]["profile_id"] = profileId)) {
            alias =
              matchRecord.matchhistoryreportresults[temp].profile.alias +
              ", " +
              matchRecord.matchhistoryreportresults[temp].profile.country.toUpperCase();
          }
          break;
        }
        break;
      }
    }

    return alias;
  }

  const columns: ColumnsType<any> = [
    {
      title: "Match ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.startgametime - b.startgametime,
      render: (_text: any, record: any) => {
        return (
          <>
            <div>{record.id}</div>
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
          text: "1 v 1",
          value: "1",
        },
        {
          text: "2 v 2",
          value: "2",
        },
        {
          text: "3 v 3",
          value: "3",
        },
        {
          text: "4 v 4",
          value: "4",
        },
      ],
      onFilter: (value: any, record: any) => record.matchtype_id == value,
      render: (_text: any, record: any) => {
        return (
          <>
            <div>{formatMatchtypeID(record.matchtype_id)}</div>
            <div>
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
        return <p>{getMatchResult(record.matchhistoryreportresults)}</p>;
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
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="48px"
              alt={player.race_id}
            />
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
            <img
              key={player.profile_id}
              src={getRaceImage(raceIds[player.race_id])}
              height="48px"
              alt={player.race_id}
            />
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
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </>
    );
  }
};

export default LastMatchesTableRelic;

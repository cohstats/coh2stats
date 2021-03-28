import { Col, Row, Space, Table } from "antd";
import {
  singleMatchObjectAfterTransform,
  singleMatchObjectAfterTransform2v2,
  singleMatchObjectAfterTransformAxis,
} from "./testMatch";
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

  useEffect(() => {
    // FYI this is special trick, anonymous function which is directly called - we need cos of compiler
    (async () => {
      // prepare the payload - you can modify the ID but it has to be in this format
      const payLoad = { profileName: "/steam/76561198034318060" };

      // prepare the CF
      const getMatchesFromRelic = firebase.functions().httpsCallable("getPlayerMatchesFromRelic");

      try {
        // call the CF
        const matches = await getMatchesFromRelic(payLoad);
        // we have the data let's save it into the state
        console.log(matches.data["playerMatches"]);

        setIsLoaded(true);
        setMatches(matches.data["playerMatches"]);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  let matchRecords = matches;

  const columns: ColumnsType<any> = [
    {
      title: "Match ID",
      dataIndex: "id",
      key: "id",
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
            <h1> Recent matches </h1>
          </Col>
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={matchRecords}
              rowKey={(record) => record.id}
              size="middle"
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </>
    );
  }
};

export default LastMatchesTableRelic;

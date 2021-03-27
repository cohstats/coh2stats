import { Col, Row, Space, Table, Tag } from "antd";
import { RaceName } from "../../coh/types";
import {
  singleMatchObjectAfterTransform,
  singleMatchObjectAfterTransform2v2,
  singleMatchObjectAfterTransformAxis,
} from "./testMatch";

import { ColumnsType } from "antd/lib/table";

export const LastMatchesTable = () => {
  let matchRecords = [
    singleMatchObjectAfterTransform,
    singleMatchObjectAfterTransformAxis,
    singleMatchObjectAfterTransform2v2,
  ];

  function getMatchDuration(startTime: number, endTime: number) {
    return new Date((endTime - startTime) * 1000).toISOString().substr(11, 8); //return duration in HH:MM:SS format
  }

  function formatMatchTime(startTime: number) {
    const hourMillis = 3600 * 1000; // one day in a miliseconds range
    let difference = Date.now() - startTime * 1000; // start match vs NOW time difference in miliseconds
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    let timeDifference = "";

    if (difference < hourMillis) {
      timeDifference = new Date(difference).toISOString().substr(14, 2) + " minutes ago";
    } else if (difference < hourMillis * 24) {
      timeDifference =
        new Date(difference).toISOString().substr(11, 2) +
        " hours " +
        new Date(difference).toISOString().substr(14, 2) +
        " minutes ago";
    } else if (difference < hourMillis * 128) {
      timeDifference = new Date(difference).toISOString().substr(9, 1) + " days ago";
    } else {
      timeDifference = new Date(startTime * 1000).toLocaleDateString("en-US", options);
    }
    return timeDifference; //return duration in HH:MM:SS format
  }

  const raceIds: Record<number, RaceName> = {
    0: "wermacht",
    1: "soviet",
    2: "wgerman",
    3: "usf",
    4: "british",
  };

  function getMatchPlayersByFaction(
    reportedPlayerResults: Array<any>,
    faction: "axis" | "allies",
  ) {
    let factions = [];
    // loop thru all players
    for (let myKey in reportedPlayerResults) {
      switch (faction) {
        // search for all axis players
        case "axis":
          if (
            reportedPlayerResults[myKey].race_id === 0 ||
            reportedPlayerResults[myKey].race_id === 2
          ) {
            factions.push(reportedPlayerResults[myKey]);
          }
          break;
        // search for allies players
        case "allies":
          if (
            reportedPlayerResults[myKey].race_id !== 0 &&
            reportedPlayerResults[myKey].race_id !== 2
          ) {
            factions.push(reportedPlayerResults[myKey]);
          }
          break;
      }
    }
    return factions;
  }

  function getMatchResult(reportedPlayerResults: Array<any>) {
    let winner: string = "";
    let color = "geekblue";

    // loop thru all players
    for (let myKey2 in reportedPlayerResults) {
      // find a winner
      if (reportedPlayerResults[myKey2].resulttype === 1) {
        // if its a axis player by race
        if (
          reportedPlayerResults[myKey2].race_id === 0 ||
          reportedPlayerResults[myKey2].race_id === 2
        ) {
          winner = "Axis victory"; // return axis victory
          color = "volcano";
        } else {
          winner = "Allies victory"; // else return allies victory
        }
        break;
      }
    }
    return <Tag color={color}>{winner.toUpperCase()}</Tag>;
  }

  const formatMatchtypeID = (matchType: number): string => {
    let formattedMatchType: string;
    switch (matchType) {
      case 1:
        formattedMatchType = "1 v 1 ";
        break;
      case 2:
        formattedMatchType = "2 v 2 ";
        break;
      case 3:
        formattedMatchType = "3 v 3 ";
        break;
      case 4:
        formattedMatchType = "4 v 4 ";
        break;
      default:
        formattedMatchType = "unknown";
        break;
    }
    return formattedMatchType;
  };

  function getRaceImage(race: RaceName) {
    return `../resources/generalIcons/${race}.png`;
  }

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
              {" "}
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
      onFilter: (value: any, record: any) => record.matchtype_id === value,
      render: (_text: any, record: any) => {
        return (
          <>
            <div>{formatMatchtypeID(record.matchtype_id)}</div>
            <div>
              {" "}
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
        formatMatchTime(record.startgametime);
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },

    {
      title: "Axis Players",
      dataIndex: "axisplayers",
      key: "axisplayers",
      responsive: ["xl"],
      render: (_text: any, record: any) => {
        let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "axis");

        let Images = axisPlayers.map((player) => {
          return (
            <img src={getRaceImage(raceIds[player.race_id])} height="48px" alt={player.race_id} />
          );
        });
        return <Space>{Images}</Space>;
      },
    },

    {
      title: "Allies Players",
      dataIndex: "alliesplayers",
      key: "alliesplayers",
      responsive: ["xl"],
      render: (_text: any, record: any) => {
        let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "allies");

        let Images = axisPlayers.map((player) => {
          return (
            <img src={getRaceImage(raceIds[player.race_id])} height="48px" alt={player.race_id} />
          );
        });
        return <Space>{Images}</Space>;
      },
    },
  ];

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
          <Table columns={columns} dataSource={matchRecords} size="middle" />
        </Col>
        <Col span={2}></Col>
      </Row>
    </>
  );
};

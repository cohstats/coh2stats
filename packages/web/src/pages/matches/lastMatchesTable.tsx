import React from "react";
import { Col, Row, Space, Table, Tag } from "antd";

import { useHistory } from "react-router";
import { RaceName } from "../../coh/types";
import routes from "../../routes";
import { singleMatchObjectAfterTransform, singleMatchObjectAfterTransformAxis } from "./testMatch";
import { ColumnsType } from "antd/lib/table";

export const LastMatchesTable = () => {
  let matchRecords = [singleMatchObjectAfterTransform, singleMatchObjectAfterTransformAxis];

  function getMatchDuration(startTime: number, endTime: number) {
    return new Date((endTime - startTime) * 1000).toISOString().substr(11, 8); //return duration in HH:MM:SS format
  }


  const raceIds: Record<number, RaceName> = {
    0: "wermacht",
    1: "soviet",
    2: "wgerman",
    3: "usf",
    4: "british",
  };

  function getMatchPlayersByFaction(reportedPlayerResults: Array<any>, faction: "axis" | "allies") {

    let factions = []
    for (let key in reportedPlayerResults) { // loop thru all players
      switch (faction) {
        case "axis":
          if (reportedPlayerResults[key].race_id == 0 || reportedPlayerResults[key].race_id == 2 ) // search for all axis players
          {
              factions.push(reportedPlayerResults[key])
          }
          break;
        case "allies":
          if (reportedPlayerResults[key].race_id !== 0 && reportedPlayerResults[key].race_id !== 2 ) // search for allies players
          {
              factions.push(reportedPlayerResults[key])
          }
          break;
      }
    }  
    console.log(factions)
    return factions
  }


  function getMatchResult(reportedPlayerResults: Array<any>) {
    let winner: string = "";
    let color = "geekblue";

    for (let key in reportedPlayerResults) { // loop thru all players
      if (reportedPlayerResults[key].resulttype == 1) {
        // find a winner
        if (reportedPlayerResults[key].race_id == 0 || reportedPlayerResults[key].race_id == 2) {
          // if its a axis player by race
          winner = "Axis victory"; // return axis victory
          color = "volcano";
        } 
        else {
          winner = "Allies victory"; // else return allies victory
        }
        break;
      }
    }
    return (
      <Tag color={color} key={winner}>
        {winner.toUpperCase()}
      </Tag>
    );
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
      key: "id" ,
    },

    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id" ,

      render: (_text: any, record: any) => {
        return (
          <p>
            {" "}
            {formatMatchtypeID(record.matchtype_id)}
            <sub> {record.description.toLowerCase()} </sub>
          </p>
        );
      },
    },

    {
      title: "Map",
      dataIndex: "mapname",
      key: "mapname" ,
      render: (_text: any, record: any) => {
        return (
          <p> {record.mapname} </p>
        );
      },
    },

    {
      title: "Result",
      key: "result" ,
      render: (_text: any, record: any) => {
        return <p>{getMatchResult(record.matchhistoryreportresults)}</p>;
      },
    },

    {
      title: "Match duration",
      key: "matchuration" ,
      render: (_text: any, record: any) => {
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },

    {
      title: "Axis Players",
      key: "axisplayers" ,
      render: (_text: any, record: any) => {
        let axisPlayers =  getMatchPlayersByFaction(record.matchhistoryreportresults,"axis")
        
        return (
          <div>
          <img
            src={getRaceImage(raceIds[axisPlayers[0].race_id])}
            height="64px"
            alt={record.icon}
          />
        </div>
        )  ;
      },
    },


    {
      title: "Allies Players",
      key: "alliesplayers",
      dataIndex: "matchhistoryreportresults",
      render: (tags: any[]) => (
        <>
          <Space>
            {tags.map((tag) => {
             
             let axisPlayers =  getMatchPlayersByFaction(tags,"axis")

              return (
                <Tag>
                  {tag.race_id}
                </Tag>
              );
            })}
          </Space>
        </>
      ),
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

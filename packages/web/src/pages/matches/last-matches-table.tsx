import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row, Space, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  formatMapName,
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  getRaceImage,
  raceIds,
  getAliasFromName,
} from "./table-functions";
import "./tableStyle.css";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { BulbOutlined, DatabaseOutlined } from "@ant-design/icons";
import { RelicIcon } from "../../components/relic-icon";
import MatchDetails from "./match-details";
import { MatchPlayerDetailsTable } from "./match-details-table";
import { useMediaQuery } from "react-responsive";
import { SimplePieChart } from "../../components/charts-match/simple-pie";
import firebaseAnalytics from "../../analytics";

const ExpandedMatch: React.FC<{ record: any }> = ({ record }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    firebaseAnalytics.playerCardMatchDetailsDisplayed();
  }, []);

  if (!record) {
    return <></>;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleDownloadGameData = () => {
    const blob = new Blob([JSON.stringify(record)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `coh2stats_match_${record.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let axisPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "axis");
  let alliesPlayers = getMatchPlayersByFaction(record.matchhistoryreportresults, "allies");

  const simplifiedDmgDataChartAxis = axisPlayers.map((stats) => {
    return {
      id: stats?.profile?.alias,
      label: stats?.profile?.alias,
      value: JSON.parse(stats?.counters).dmgdone,
    };
  });

  const simplifiedDmgDataChartAllies = alliesPlayers.map((stats) => {
    return {
      id: stats?.profile?.alias,
      label: stats?.profile?.alias,
      value: JSON.parse(stats?.counters).dmgdone,
    };
  });

  const simplifiedKillsDataChartAxis = axisPlayers.map((stats) => {
    return {
      id: stats?.profile?.alias,
      label: stats?.profile?.alias,
      value: JSON.parse(stats?.counters).ekills,
    };
  });

  const simplifiedKillsDataChartAllies = alliesPlayers.map((stats) => {
    return {
      id: stats?.profile?.alias,
      label: stats?.profile?.alias,
      value: JSON.parse(stats?.counters).ekills,
    };
  });

  return (
    <div>
      <Row key={"details"} style={{ paddingTop: 5 }}>
        <Col span={12}>
          <MatchPlayerDetailsTable data={axisPlayers} smallView={true} />
        </Col>
        <Col span={12}>
          <MatchPlayerDetailsTable data={alliesPlayers} smallView={true} />
        </Col>
      </Row>
      <Row justify={"center"} key={"charts"} style={{ paddingTop: 5, height: 200 }}>
        <Col span={12} style={{ height: 200 }}>
          <Space style={{ justifyContent: "center", display: "flex", paddingTop: 15 }}>
            <Card
              title={<div style={{ textAlign: "center" }}>Damage dealt</div>}
              size={"small"}
              bordered={false}
              bodyStyle={{ height: 140, width: 140, padding: 0 }}
            >
              <SimplePieChart data={simplifiedDmgDataChartAxis} />
            </Card>
            <Card
              title={<div style={{ textAlign: "center" }}>Kills</div>}
              size={"small"}
              bordered={false}
              bodyStyle={{ height: 140, width: 140, padding: 0 }}
            >
              <SimplePieChart data={simplifiedKillsDataChartAxis} />
            </Card>
          </Space>
        </Col>
        <Col span={12}>
          <Space style={{ justifyContent: "center", display: "flex", paddingTop: 15 }}>
            <Card
              title={<div style={{ textAlign: "center" }}>Damage Dealt</div>}
              size={"small"}
              bordered={false}
              bodyStyle={{ height: 140, width: 140, padding: 0 }}
            >
              <SimplePieChart data={simplifiedDmgDataChartAllies} />
            </Card>
            <Card
              title={<div style={{ textAlign: "center" }}>Unit Kills</div>}
              size={"small"}
              bordered={false}
              bodyStyle={{ height: 140, width: 140, padding: 0 }}
            >
              <SimplePieChart data={simplifiedKillsDataChartAllies} />
            </Card>
          </Space>
        </Col>
      </Row>
      <Row key={"expand_button"} justify="center">
        <Button
          size={"middle"}
          type="primary"
          onClick={showModal}
          style={{ display: "flex", marginTop: -110 }}
        >
          Open Full Details
        </Button>
        <Modal
          style={{ top: 20 }}
          width={1810}
          title="Match Details"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          cancelButtonProps={{ hidden: true }}
          okText={"Close"}
          footer={[
            <Button onClick={handleDownloadGameData}>Download game data</Button>,
            <Button onClick={handleCancel} type="primary">
              Close
            </Button>,
          ]}
        >
          <MatchDetails data={record} />
        </Modal>
      </Row>
    </div>
  );
};

interface IProps {
  data: Array<Record<string, any>>;
  profileID: string; // has to be in format "/steam/{steamID}"
}

const LastMatchesTable: React.FC<IProps> = ({ data, profileID }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

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
  // set play alias
  let playerAlias = getAliasFromName(localLoadedMatches[0], profileID) || "unknown player alias";

  // returns a filter setting for player maps
  function getPlayerMapListFilter(matches: any) {
    let mapSet = new Set();
    let filterSettings: any[] = [];
    for (const map of matches) {
      mapSet.add(map.mapname);
    }

    // sort maps alphabetically
    let sortedMapsArray = Array.from(mapSet).sort((a: any, b: any) => {
      return a.localeCompare(b);
    });

    for (const map of sortedMapsArray) {
      filterSettings.push({
        text: formatMapName(map),
        value: map,
      });
    }

    return filterSettings;
  }

  let matchRecords = localLoadedMatches;

  function isPlayerVictorious(matchRecord: any): boolean {
    if (!matchRecord) return false;

    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name === profileID,
    );
    return resultItem[0].resulttype === 1;
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
              <Tooltip title={player.profile.alias} key={player.profile.alias}>
                <img
                  key={player.profile_id}
                  src={getRaceImage(raceIds[player.race_id])}
                  height="48px"
                  width="48px"
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
  ];

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
        style={{ paddingTop: 5, overflow: "auto" }}
        pagination={{
          defaultPageSize: 60,
          pageSizeOptions: ["20", "40", "60", "100", "200"],
        }}
        columns={columns}
        dataSource={matchRecords}
        rowKey={(record) => record.id}
        size="middle"
        rowClassName={(record) => (isPlayerVictorious(record) ? "green" : "red")}
        expandable={{
          expandedRowRender: renderExpandedMatch,
          rowExpandable: (_) => !isMobile,
          expandRowByClick: true,
          expandIconColumnIndex: 20,
        }}
      />
    </>
  );
};

export default LastMatchesTable;

import { Button, Card, Col, Modal, Row, Space, Tag } from "antd";
import { RaceName } from "../coh/types";
import React, { useEffect, useState } from "react";
import firebaseAnalytics from "../analytics";
import { MatchPlayerDetailsTable } from "../pages/matches/match-details-table";
import { SimplePieChart } from "../components/charts-match/simple-pie";
import MatchDetails from "../pages/matches/match-details";

/**
 * Returns duration string in HH:MM:SS format
 */
export function getMatchDuration(startTime: number, endTime: number) {
  return new Date((endTime - startTime) * 1000).toISOString().substr(11, 8); //return duration in HH:MM:SS format
}

/**
 * Returns src of <img> tag for each race
 */
export function getRaceImage(race: RaceName) {
  return `/resources/generalIcons/${race}.png`;
}

/**
 * Returns human readable mapname
 * TODO FINISH THIS / mapping of ugly relic mapname to a pretty mapname
 */
export function formatMapName(mapname: any) {
  return mapname.toUpperCase();
}

/**
 * Returns string based on how much time elapsed from the match start
 *
 * Time < 1 Hour      returns MM minutes ago
 *
 * Time < 1 Day       returns HH hours MM minutes ago
 *
 * Time < 5 Days      returns X days ago
 *
 * Time > 5 days      returns en-US locale date
 */
export function formatMatchTime(startTime: number, onlyDate = false) {
  const hourMillis = 3600 * 1000; // one day in a miliseconds range
  let difference = Date.now() - startTime * 1000; // start match vs NOW time difference in miliseconds
  const options: Intl.DateTimeFormatOptions = {
    //weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let timeDifference = "";

  if (difference < hourMillis) {
    timeDifference = new Date(difference).toISOString().substr(14, 2) + " minutes ago";
  } else if (difference < hourMillis * 24) {
    timeDifference = new Date(difference).toISOString().substr(11, 2) + " hours ago";
  } else if (difference < hourMillis * 128) {
    timeDifference = new Date(difference).toISOString().substr(9, 1) + " days ago";
  } else {
    timeDifference = new Date(startTime * 1000).toLocaleDateString("en-US", options);
  }

  if (onlyDate) {
    timeDifference = new Date(startTime * 1000).toLocaleDateString("en-US", options);
  }

  return timeDifference; //return duration in HH:MM:SS format
}

/**
 * Returns Array of players belonging to faction "axis" | "allies"
 */
export function getMatchPlayersByFaction(
  reportedPlayerResults: Array<any>,
  faction: "axis" | "allies",
) {
  let factions = [];
  // loop through all players
  for (let playerResult of reportedPlayerResults) {
    switch (faction) {
      // search for all axis players
      case "axis":
        if (playerResult.race_id === 0 || playerResult.race_id === 2) {
          factions.push(playerResult);
        }
        break;
      // search for allies players
      case "allies":
        if (playerResult.race_id !== 0 && playerResult.race_id !== 2) {
          factions.push(playerResult);
        }
        break;
    }
  }
  return factions;
}

/**
 * Returns Antd element <Tag> [Axis victory] or [Allies victory]
 */
export function getMatchResult(reportedPlayerResults: Array<any>) {
  let winner: string = "";
  let color = "#108ee9";

  // loop thru all players
  for (let index of reportedPlayerResults) {
    // find a winner
    if (reportedPlayerResults[index].resulttype === 1) {
      // if its a axis player by race
      if (
        reportedPlayerResults[index].race_id === 0 ||
        reportedPlayerResults[index].race_id === 2
      ) {
        winner = "Axis victory"; // return axis victory
        color = "#f50";
      } else {
        winner = "Allies victory"; // else return allies victory
      }
      break;
    }
  }
  return <Tag color={color}>{winner.toUpperCase()}</Tag>;
}

/**
 * Returns String 1v1, 2v2 etc... based on matchType parameter
 */
export const formatMatchtypeID = (matchType: number): string => {
  let formattedMatchType: string;
  switch (matchType) {
    case 1:
      formattedMatchType = "1 vs 1";
      break;
    case 2:
      formattedMatchType = "2 vs 2";
      break;
    case 3:
      formattedMatchType = "3 vs 3";
      break;
    case 4:
      formattedMatchType = "4 vs 4";
      break;
    case 5:
      formattedMatchType = "2v2 AI Easy";
      break;
    case 6:
      formattedMatchType = "2v2 AI Medium";
      break;
    case 7:
      formattedMatchType = "2v2 AI Hard";
      break;
    case 8:
      formattedMatchType = "2v2 AI Expert";
      break;
    case 9:
      formattedMatchType = "3v3 AI Easy";
      break;
    case 10:
      formattedMatchType = "3v3 AI Medium";
      break;
    case 11:
      formattedMatchType = "3v3 AI Hard";
      break;
    case 12:
      formattedMatchType = "3v3 AI Expert";
      break;
    case 13:
      formattedMatchType = "4v4 AI Easy";
      break;
    case 14:
      formattedMatchType = "4v4 AI Medium";
      break;
    case 15:
      formattedMatchType = "4v4 AI Hard";
      break;
    case 16:
      formattedMatchType = "4v4 AI Expert";
      break;
    case 17:
      formattedMatchType = "4v4 AI Easy";
      break;
    case 0:
    // This is empty on purpose, lol case
    // eslint-disable-next-line no-fallthrough
    case 22:
      formattedMatchType = "Custom Game";
      break;
    default:
      formattedMatchType = "unknown";
      break;
  }
  return formattedMatchType;
};

/**
 * Dictionary of {relic race number, raceName}
 */
export const raceIds: Record<number, RaceName> = {
  0: "wermacht",
  1: "soviet",
  2: "wgerman",
  3: "usf",
  4: "british",
};

/**
 * Returns string in format playerAllias, COUNTRY
 * @param matchRecord is a single record from array returned by relic api
 * @param name is steamID in relic api call format, example "/steam/76561198034318060"
 */
export function getAliasFromName(matchRecord: any, name: string) {
  if (!matchRecord) return "unknown";
  let resultItem = matchRecord.matchhistoryreportresults.filter(
    (result: any) => result.profile.name === name,
  );
  return resultItem[0].profile.alias;
}

export const ExpandedMatch: React.FC<{ record: any }> = ({ record }) => {
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

// returns a filter setting for player maps
export function getPlayerMapListFilter(matches: any) {
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

export const isMobileMediaQuery = "(max-width: 1023px)";

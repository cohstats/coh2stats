import React, { useEffect, useState } from "react";

import { Col, Row, Tooltip, Typography, Avatar, Tabs } from "antd";
import { LaddersDataObject } from "../../coh/types";
import firebaseAnalytics from "../../analytics";
import { capitalize, timeAgo } from "../../helpers";
import { firebase } from "../../firebase";

import { CountryFlag } from "../../components/country-flag";
import { playerCardBase } from "../../titles";
import { useParams } from "react-router";
import { findAndMergeStatGroups, getGeneralIconPath } from "../../coh/helpers";
import { Loading } from "../../components/loading";
import Title from "antd/es/typography/Title";
import PlayerSingleMatchesTable from "./player-single-matches-table";
import {
  calculateOverallStatsForPlayerCard,
  prepareLeaderBoardDataForSinglePlayer,
} from "./data-processing";
import PlayerTeamMatchesTable from "./player-team-matches-table";
import { convertTeamNames } from "./helpers";
import LastMatchesTableRelic from "../matches/lastMatchesTableRelic";
const { Text } = Typography;
const { TabPane } = Tabs;

type playerCardAPIObject = Record<"relicPersonalStats" | "steamProfile", Record<string, any>>;

type statGroupsType = Array<Record<string, any>>;

const findPlayerProfile = (statGroups: statGroupsType) => {
  for (const statGroup of statGroups) {
    if (statGroup["type"] === 1) {
      return statGroup["members"][0];
    }
  }
};

const PlayerCard = () => {
  const { steamid } = useParams<{
    steamid: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | playerCardAPIObject>(null);
  // Set page title
  document.title = `${playerCardBase}`;

  useEffect(() => {
    firebaseAnalytics.playerCardDisplayed();

    setIsLoading(true);

    (async () => {
      const payLoad = { steamID: steamid };
      const getPlayerPersonalStats = firebase.functions().httpsCallable("getPlayerPersonalStats");
      try {
        const { data } = await getPlayerPersonalStats(payLoad);
        setData(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [steamid]);

  if (!isLoading && error != null) {
    return <>{JSON.stringify(error)}</>;
  }

  if (isLoading || !data || data?.steamProfile[steamid] === undefined) {
    return (
      <div style={{ paddingTop: 50 }}>
        <Loading />
      </div>
    );
  }

  const steamProfile = data?.steamProfile[steamid];

  const relicData = data?.relicPersonalStats;
  const statGroups = relicData?.statGroups;
  const playerRelicProfile = findPlayerProfile(statGroups);

  const playerName = playerRelicProfile.alias;
  document.title = `${playerCardBase} - ${playerName}`;

  const mergedGamesData = findAndMergeStatGroups(relicData as LaddersDataObject, null);
  const { finalStatsSingleGame, finalStatsTeamGames } =
    prepareLeaderBoardDataForSinglePlayer(mergedGamesData);

  const { totalGames, lastGameDate, bestRank, mostPlayed } = calculateOverallStatsForPlayerCard(
    relicData.leaderboardStats,
  );

  const singleTables: Array<any> = [];
  const teamTables: Array<any> = [];

  for (const key of Object.keys(finalStatsSingleGame)) {
    singleTables.push(
      <PlayerSingleMatchesTable key={key} title={key} data={finalStatsSingleGame[key]} />,
    );
  }

  for (const key of Object.keys(finalStatsTeamGames)) {
    if (finalStatsTeamGames[key].length !== 0) {
      teamTables.push(
        <PlayerTeamMatchesTable key={key} title={key} data={finalStatsTeamGames[key]} />,
      );
    }
  }

  return (
    <div key={steamid}>
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Col xs={23} md={22} xxl={14}>
          <div style={{ float: "left" }}>
            <a href={steamProfile["profileurl"]} target={"_blank"} rel="noreferrer">
              <Avatar
                size={110}
                shape="square"
                src={steamProfile["avatarfull"]}
                style={{ display: "inline-block", verticalAlign: "top" }}
                alt={"avatar"}
              />
            </a>
            <div style={{ display: "inline-block", paddingLeft: 15, textAlign: "left" }}>
              <Title level={2}>
                <CountryFlag countryCode={playerRelicProfile.country} />
                {playerName}
              </Title>
              <b>XP:</b> {playerRelicProfile.xp.toLocaleString()}
              {playerRelicProfile.xp === 18785964 ? " (MAX)" : ""}
            </div>
          </div>
          <div style={{ float: "right", paddingLeft: 15 }}>
            {mostPlayed.race !== "allies" && mostPlayed.race !== "axis" && (
              <Tooltip
                title={`Most played as ${mostPlayed.race} in ${convertTeamNames(
                  mostPlayed.mode,
                )} with ${mostPlayed.games} games`}
              >
                <img
                  src={getGeneralIconPath(mostPlayed.race)}
                  height="120px"
                  alt={mostPlayed.race}
                />
              </Tooltip>
            )}
          </div>
          <div style={{ float: "right", textAlign: "right" }}>
            <div>
              {bestRank.rank !== Infinity ? (
                <>
                  Current best rank <Text strong>{bestRank.rank}</Text> in{" "}
                  <Text strong>
                    {convertTeamNames(bestRank.mode)} as {capitalize(bestRank.race)}
                  </Text>
                </>
              ) : (
                <>
                  Currently <Text strong>unranked</Text>
                </>
              )}
            </div>
            <div>
              Most played{" "}
              <Text strong>
                {convertTeamNames(mostPlayed.mode)} as {capitalize(mostPlayed.race)}
              </Text>
            </div>
            <div>
              <Text strong>{totalGames} total games</Text>
            </div>
            <br />
            <div>
              <Tooltip title={new Date(lastGameDate * 1000).toLocaleString()}>
                Last match{" "}
                {timeAgo.format(Date.now() - (Date.now() - lastGameDate * 1000), "round-minute")}
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} md={22} xxl={14}>
          <Tabs defaultActiveKey="playerStats" size={"large"} centered>
            <TabPane tab={"Standings"} key="playerStats">
              {singleTables}
              {teamTables}
            </TabPane>
            <TabPane tab="Recent matches" key="matchHistory">
              <LastMatchesTableRelic />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default PlayerCard;

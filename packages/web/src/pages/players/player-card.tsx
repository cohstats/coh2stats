import React, { useEffect, useState } from "react";

import { Col, Row, Tooltip, Typography, Avatar, Tabs } from "antd";
import { LaddersDataObject } from "../../coh/types";
import firebaseAnalytics from "../../analytics";
import { capitalize, timeAgo, useQuery } from "../../utils/helpers";

import { CountryFlag } from "../../components/country-flag";
import { playerCardBase } from "../../titles";
import { useHistory, useParams } from "react-router";
import { getGeneralIconPath } from "../../coh/helpers";
import { Loading } from "../../components/loading";
import Title from "antd/es/typography/Title";
import { calculateOverallStatsForPlayerCard } from "./data-processing";
import { convertTeamNames } from "./helpers";
import LastMatchesTable from "../matches/last-matches-table";
import routes from "../../routes";
import PlayerStandingsTables from "./player-standings";
import config from "../../config";
import { AlertBox } from "../../components/alert-box";
const { Text } = Typography;
const { TabPane } = Tabs;

type playerCardAPIObject = {
  relicPersonalStats: Record<string, any>;
  steamProfile: Record<string, any>;
  playerMatches: Array<Record<string, any>>;
};

type statGroupsType = Array<Record<string, any>>;

const findPlayerProfile = (statGroups: statGroupsType) => {
  for (const statGroup of statGroups) {
    if (statGroup["type"] === 1) {
      return statGroup["members"][0];
    }
  }
};

const PlayerCard = () => {
  const { push } = useHistory();

  const { steamid } = useParams<{
    steamid: string;
  }>();

  const query = useQuery();
  const tabView = query.get("view") || "stats";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | playerCardAPIObject>(null);
  // Set page title
  document.title = `${playerCardBase}`;

  useEffect(() => {
    firebaseAnalytics.playerCardDisplayed();

    setIsLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `https://${config.firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/getPlayerCardEverythingHttp?steamid=${steamid}`,
        );
        if (!response.ok) {
          throw new Error(
            `API request failed with code: ${response.status}, res: ${await response.text()}`,
          );
        }
        setData(await response.json());
      } catch (e) {
        let errorMessage = "Failed to do something exceptional";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.error(e);
        setError(JSON.stringify(errorMessage));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [steamid]);

  if (!isLoading && error != null) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={"There was an error loading the player card"}
          description={`${JSON.stringify(error)}`}
        />
      </Row>
    );
  }

  // This protects all the requests accessing data
  if (isLoading || !data || data.steamProfile[steamid] === undefined) {
    return (
      <div style={{ paddingTop: 50 }}>
        <Loading />
      </div>
    );
  }

  const changeTheUrl = (view: string) => {
    const searchValue = view !== "stats" ? `?${new URLSearchParams({ view })}` : "";

    push({
      pathname: routes.playerCardWithId(steamid),
      search: searchValue,
    });
  };

  const steamProfile = data.steamProfile[steamid];

  const relicData = data.relicPersonalStats;
  const statGroups = relicData.statGroups;
  const playerRelicProfile = findPlayerProfile(statGroups);

  const playerName = playerRelicProfile.alias;
  document.title = `${playerCardBase} - ${playerName}`;

  const { totalGames, lastGameDate, bestRank, mostPlayed, totalWinRate } =
    calculateOverallStatsForPlayerCard(relicData.leaderboardStats);

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
              <div>
                <a href={steamProfile["profileurl"]} target={"_blank"} rel="noreferrer">
                  <Avatar size={24} src={"/resources/steam_icon.png"} alt={"steam icon"} />
                </a>
              </div>
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
            <div>
              <Text strong>{(totalWinRate * 100).toFixed(0)}% total winrate</Text>
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
          <Tabs defaultActiveKey={tabView} size={"large"} centered onChange={changeTheUrl}>
            <TabPane tab={"Standings"} key="stats">
              <PlayerStandingsTables data={relicData as LaddersDataObject} />
            </TabPane>
            <TabPane tab="Recent matches" key="matches">
              <LastMatchesTable data={data["playerMatches"]} profileID={`/steam/${steamid}`} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default PlayerCard;

import React, { useContext, useEffect, useState } from "react";

import { Col, Row, Tooltip, Typography, Avatar, Tabs, Badge, notification } from "antd";
import { LaddersDataObject } from "../../../coh/types";
import firebaseAnalytics from "../../../analytics";
import { capitalize, getAPIUrl, timeAgo, useQuery } from "../../../utils/helpers";

import { CountryFlag } from "../../../components/country-flag";
import { playerCardBase } from "../../../titles";
import { useHistory, useParams } from "react-router";
import { getGeneralIconPath } from "../../../coh/helpers";
import { Loading } from "../../../components/loading";
import Title from "antd/es/typography/Title";
import { calculateOverallStatsForPlayerCard } from "./data-processing";
import { convertTeamNames } from "./helpers";
import LastMatchesTable from "../../matches/last-matches-table";
import PlayerStandingsTables from "./player-standings";
import config from "../../../config";
import { AlertBox } from "../../../components/alert-box";
import AllMatchesTable from "../../matches/all-matches-table";
import { ConfigContext } from "../../../config-context";
import { Space } from "antd/es";
import { AlertBoxChina } from "../../../components/alert-box-china";

const { Text } = Typography;

type playerCardAPIObject = {
  relicPersonalStats: Record<string, any>;
  steamProfile: Record<string, any>;
  playerMatches: Array<Record<string, any>>;
  playTime: null | number;
  playerInfo: null | Record<string, any>;
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
  const { push, replace } = useHistory();

  const { steamid } = useParams<{
    steamid: string;
  }>();

  const { userConfig } = useContext(ConfigContext);

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

    const addNameToUrl = (playerName: string) => {
      if (!playerName) {
        return;
      }

      const cleanName = playerName.replace(/[^a-zA-Z0-9-_]/g, "");
      // If it's not in the path, let's push it there
      if (!window.location.pathname.includes(cleanName)) {
        // This means there is already a name, but it was changed!
        if (window.location.pathname.match(/.+\/\d+-/)) {
          // There is already name in url let's replace it with a new one
          replace({
            pathname: `${window.location.pathname.replace(/(.+\/\d+-)(.+)/, `$1${cleanName}`)}`,
          });
        } else {
          // No name in the url let's just push a new one
          replace({
            pathname: `${window.location.pathname}-${cleanName}`,
          });
        }
      }
    };

    (async () => {
      try {
        const response = await fetch(
          `${getAPIUrl(
            userConfig,
          )}getPlayerCardEverythingHttp?steamid=${steamid}&includeMatches=false`,
          {},
        );
        if (!response.ok) {
          throw new Error(
            `API request failed with code: ${response.status}, res: ${await response.text()}`,
          );
        }

        const finalData: playerCardAPIObject = await response.json();
        setData(finalData);
        if(finalData.steamProfile && Object.values(finalData.steamProfile)[0].personaname){
          addNameToUrl(Object.values(finalData.steamProfile)[0].personaname);
        }
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
  }, [steamid, replace, userConfig]);

  if (!isLoading && error != null) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Space direction={"vertical"}>
          <AlertBox
            type={"error"}
            message={"There was an error loading the player card. Try refreshing the page."}
            description={`${JSON.stringify(error)}`}
          />
          <AlertBoxChina />
        </Space>
      </Row>
    );
  }

  // This protects all the requests accessing data
  if (isLoading || !data || (data?.steamProfile && data?.steamProfile[steamid] === undefined)) {
    // This can happen in case steam API is not responding  and steamProfile is null but other fields are populated
    if (
      data?.steamProfile === null &&
      Object.values(data?.relicPersonalStats?.statGroups).length > 0
    ) {
      notification["warning"]({
        message: "Steam API is not responding",
        description:
          "The player card might not work correctly, please try again later or report it to our Discord.",
      });
    } else {
      return (
        <div style={{ paddingTop: 50 }}>
          <Loading />
        </div>
      );
    }
  }

  const changeTheUrl = (view: string) => {
    const searchValue = view !== "stats" ? `?${new URLSearchParams({ view })}` : "";

    push({
      search: searchValue,
    });
  };

  const steamProfile = data.steamProfile ? data.steamProfile[steamid] : null;
  const playTime = data.playTime ? Math.floor(data.playTime / 60) : null;

  const relicData = data.relicPersonalStats;
  const statGroups = relicData.statGroups;
  const playerRelicProfile = findPlayerProfile(statGroups);

  const playerName = playerRelicProfile.alias;
  document.title = `${playerCardBase} - ${playerName}`;

  const { totalGames, lastGameDate, bestRank, mostPlayed, totalWinRate } =
    calculateOverallStatsForPlayerCard(relicData.leaderboardStats);

  const playerTabItems = [
    {
      label: "Standings",
      key: "stats",
      children: (
        <PlayerStandingsTables
          data={relicData as LaddersDataObject}
          historicLeaderboardStats={data.playerInfo?.leaderboardStats}
        />
      ),
    },
    {
      label: "Recent Matches",
      key: "recentMatches",
      children: <LastMatchesTable steamID={`${steamid}`} />,
    },
    {
      label: "Matches",
      key: "matches",
      children: <AllMatchesTable steamID={`${steamid}`} />,
    },
  ];

  return (
    <div key={steamid}>
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Col xs={23} md={22} xxl={15}>
          <div style={{ float: "left" }}>
            <a href={steamProfile?.profileurl || ""} target={"_blank"} rel="noreferrer">
              <Avatar
                size={110}
                shape="square"
                src={steamProfile?.avatarfull || ""}
                style={{ display: "inline-block", verticalAlign: "top" }}
                alt={"avatar"}
              />
            </a>
            <div style={{ display: "inline-block", paddingLeft: 15, textAlign: "left" }}>
              <Title level={2} style={{ marginBottom: 0, marginTop: "-7px" }}>
                <CountryFlag countryCode={playerRelicProfile.country} />
                {playerName}
              </Title>
              <b>XP:</b> {playerRelicProfile.xp.toLocaleString()}
              {playerRelicProfile.xp === 18785964 ? " (MAX)" : ""}
              <br />
              {playTime && <>Total playtime: {playTime} hrs</>}
              {!playTime && (
                <>
                  <br />
                </>
              )}
              <div>
                <Tooltip
                  color={"#001529"}
                  title={
                    <>
                      Steam ID:{" "}
                      <Text code style={{ color: "whitesmoke" }}>
                        {steamid}
                      </Text>
                      <br />
                      Relic ID:{" "}
                      <Text code style={{ color: "whitesmoke" }}>
                        {data.playerInfo?.profile_id}
                      </Text>
                    </>
                  }
                >
                  <Avatar
                    size={24}
                    alt={"info icon"}
                    style={{ backgroundColor: "#162452" }}
                    // Yeah, we should use svg icon, but I just didn't have the strength to properly format it
                    src={"/resources/icons/info_i.webp"}
                  />
                </Tooltip>{" "}
                <a href={steamProfile?.profileurl || ""} target={"_blank"} rel="noreferrer">
                  <Badge dot={steamProfile?.personastate >= 1} color={"green"} offset={[-2, 22]}>
                    <Avatar size={24} src={"/resources/steam_icon.png"} alt={"steam icon"} />
                  </Badge>
                </a>
                {`${config.coh2steamGameId}` === steamProfile?.gameid && (
                  <>
                    {" "}
                    <Badge
                      dot={steamProfile?.personastate >= 1}
                      color={"green"}
                      offset={[-2, 22]}
                    >
                      {" "}
                      <Avatar
                        size={24}
                        src={"/resources/coh2-icon-32.png"}
                        alt={"Is online in COH2"}
                      />{" "}
                    </Badge>{" "}
                  </>
                )}
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
              <Text strong>{totalGames} ranked games</Text>
            </div>
            <div>
              <Text strong>{(totalWinRate * 100).toFixed(0)}% ranked winrate</Text>
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
        <Col xs={24} md={22} xxl={15}>
          <Tabs
            items={playerTabItems}
            defaultActiveKey={tabView}
            size={"large"}
            centered
            onChange={changeTheUrl}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PlayerCard;

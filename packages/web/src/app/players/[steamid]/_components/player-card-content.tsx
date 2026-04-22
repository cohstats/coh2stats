"use client";

import React, { useEffect } from "react";
import { Col, Row, Tooltip, Typography, Avatar, Tabs, Badge, notification } from "antd";
import { LaddersDataObject, PlayerCardAPIObject } from "@/coh/types";
import firebaseAnalytics from "../../../../analytics";
import { capitalize, timeAgo } from "@/utils/helpers";
import { CountryFlag } from "@/components/country-flag";
import { getGeneralIconImport } from "@/coh/generalIconImports";
import { infoIcon, steamIcon, coh2Icon } from "@/coh/commonIconImports";
import Image from "next/image";
import { calculateOverallStatsForPlayerCard } from "./data-processing";
import { convertTeamNames } from "./helpers";
import LastMatchesTable from "../../../../components/matches/last-matches-table";
import PlayerStandingsTables from "./player-standings";
import config from "../../../../config";
import AllMatchesTable from "../../../../components/matches/all-matches-table";

const { Text, Title } = Typography;

type statGroupsType = Array<Record<string, any>>;

const findPlayerProfile = (statGroups: statGroupsType) => {
  for (const statGroup of statGroups) {
    if (statGroup["type"] === 1) {
      return statGroup["members"][0];
    }
  }
};

interface PlayerCardContentProps {
  initialData: PlayerCardAPIObject;
  steamidParsed: string;
  initialTabView: string;
}

export const PlayerCardContent: React.FC<PlayerCardContentProps> = ({
  initialData,
  steamidParsed,
  initialTabView,
}) => {
  const [tabView, setTabView] = React.useState(initialTabView);

  useEffect(() => {
    firebaseAnalytics.playerCardDisplayed();

    const addNameToUrl = (playerName: string) => {
      if (!playerName && typeof window === "undefined") {
        return;
      }

      const cleanName = playerName.replace(/[^a-zA-Z0-9-_]/g, "");
      const currentPath = window.location.pathname;

      // If it's not in the path, let's push it there
      if (!currentPath.includes(cleanName)) {
        let newPath: string;

        // This means there is already a name, but it was changed!
        if (currentPath.match(/.+\/\d+-/)) {
          // There is already name in url let's replace it with a new one
          newPath = currentPath.replace(/(.+\/\d+-)(.+)/, `$1${cleanName}`);
        } else {
          // No name in the url let's just push a new one
          newPath = `${currentPath}-${cleanName}`;
        }

        // Preserve query parameters and update URL without reload
        const search = window.location.search;
        window.history.replaceState(null, "", newPath + search);
      }
    };

    if (
      initialData &&
      initialData.steamProfile &&
      Object.values(initialData.steamProfile)[0]?.personaname
    ) {
      const playerName = Object.values(initialData.steamProfile)[0].personaname;
      addNameToUrl(playerName);
      document.title = `${playerName} Player Card | COH2 Stats`;
    }
  }, [initialData, steamidParsed]);

  const onTabChange = (key: string) => {
    setTabView(key);
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("view", key);
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;

    // Use window.history.replaceState to update URL without reload (shallow routing)
    window.history.replaceState(null, "", newUrl);
  };

  // Handle edge case where Steam API is not responding
  if (
    initialData?.steamProfile === null &&
    Object.values(initialData?.relicPersonalStats?.statGroups).length > 0
  ) {
    notification["warning"]({
      title: "Steam API is not responding",
      description:
        "The player card might not work correctly, please try again later or report it to our Discord.",
    });
  }

  const steamProfile = initialData.steamProfile ? initialData.steamProfile[steamidParsed] : null;
  const playTime = initialData.playTime ? Math.floor(initialData.playTime / 60) : null;

  const relicData = initialData.relicPersonalStats;
  const statGroups = relicData.statGroups;
  const playerRelicProfile = findPlayerProfile(statGroups);

  const { totalGames, lastGameDate, bestRank, mostPlayed, totalWinRate } =
    calculateOverallStatsForPlayerCard(relicData.leaderboardStats);

  const playerTabItems = [
    {
      label: "Standings",
      key: "stats",
      children: (
        <PlayerStandingsTables
          data={relicData as LaddersDataObject}
          historicLeaderboardStats={initialData.playerInfo?.leaderboardStats}
        />
      ),
    },
    {
      label: "Recent Matches",
      key: "recentMatches",
      children: (
        <LastMatchesTable
          steamID={`${steamidParsed}`}
          profileID={playerRelicProfile.profile_id}
        />
      ),
    },
    {
      label: "Matches",
      key: "matches",
      children: <AllMatchesTable steamID={`${steamidParsed}`} />,
    },
  ];

  return (
    <div key={steamidParsed}>
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
                {playerRelicProfile.alias}
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
                        {steamidParsed}
                      </Text>
                      <br />
                      Relic ID:{" "}
                      <Text code style={{ color: "whitesmoke" }}>
                        {initialData.playerInfo?.profile_id}
                      </Text>
                    </>
                  }
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: "#162452",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      position: "relative",
                    }}
                  >
                    <Image src={infoIcon} width={24} height={24} alt="info icon" />
                  </div>
                </Tooltip>{" "}
                <a href={steamProfile?.profileurl || ""} target={"_blank"} rel="noreferrer">
                  <Badge dot={steamProfile?.personastate >= 1} color={"green"} offset={[-2, 22]}>
                    <Image src={steamIcon} width={24} height={24} alt="steam icon" />
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
                      <Image src={coh2Icon} width={24} height={24} alt="Is online in COH2" />
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
                <Image
                  src={getGeneralIconImport(mostPlayed.race)}
                  height={120}
                  width={120}
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
        <Col xs={24} md={22} xxl={15} style={{ minHeight: "1500px" }}>
          <Tabs
            items={playerTabItems}
            activeKey={tabView}
            size={"large"}
            centered
            onChange={onTabChange}
          />
        </Col>
      </Row>
    </div>
  );
};

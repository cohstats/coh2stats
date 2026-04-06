// @ts-nocheck
"use client";

import React, { useEffect, useState, Suspense } from "react";

import { Col, Row, Tooltip, Typography, Avatar, Tabs, Badge, notification } from "antd";
import { LaddersDataObject, PlayerCardAPIObject } from "../../../coh/types";
import firebaseAnalytics from "../../../analytics";
import { capitalize, timeAgo } from "../../../utils/helpers";
import { fetchPlayerCardData } from "./actions";

import { CountryFlag } from "../../../components/country-flag";
import { playerCardBase } from "../../../titles";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getGeneralIconPath } from "../../../coh/helpers";
import { Loading } from "../../../components/loading";
import { calculateOverallStatsForPlayerCard } from "./_components/data-processing";
import { convertTeamNames } from "./_components/helpers";
import LastMatchesTable from "../../../components/matches/last-matches-table";
import PlayerStandingsTables from "./_components/player-standings";
import config from "../../../config";
import { AlertBox } from "../../../components/alert-box";
import AllMatchesTable from "../../../components/matches/all-matches-table";
import { Space } from "antd";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const { Text, Title } = Typography;

type statGroupsType = Array<Record<string, any>>;

const findPlayerProfile = (statGroups: statGroupsType) => {
  for (const statGroup of statGroups) {
    if (statGroup["type"] === 1) {
      return statGroup["members"][0];
    }
  }
};

const PlayerCardContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const steamid = params.steamid as string;
  const steamidParsed = steamid?.split("-")[0] || "";

  const tabView = searchParams?.get("view") || "stats";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<null | playerCardAPIObject>(null);
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    firebaseAnalytics.playerCardDisplayed();

    setIsLoading(true);

    const addNameToUrl = (playerName: string) => {
      if (!playerName) {
        return;
      }

      if (typeof window === "undefined") {
        return;
      }

      const cleanName = playerName.replace(/[^a-zA-Z0-9-_]/g, "");
      // If it's not in the path, let's push it there
      if (!window.location.pathname.includes(cleanName)) {
        // This means there is already a name, but it was changed!
        if (window.location.pathname.match(/.+\/\d+-/)) {
          // There is already name in url let's replace it with a new one
          router.replace(
            `${window.location.pathname.replace(/(.+\/\d+-)(.+)/, `$1${cleanName}`)}`,
          );
        } else {
          // No name in the url let's just push a new one
          router.replace(`${window.location.pathname}-${cleanName}`);
        }
      }
    };

    (async () => {
      try {
        const finalData = await fetchPlayerCardData(steamidParsed);
        setData(finalData);
        if (finalData.steamProfile && Object.values(finalData.steamProfile)[0].personaname) {
          addNameToUrl(Object.values(finalData.steamProfile)[0].personaname);
        }

        // Extract player name for title update
        if (finalData.relicPersonalStats?.statGroups) {
          const profile = findPlayerProfile(finalData.relicPersonalStats.statGroups);
          if (profile?.alias) {
            setPlayerName(profile.alias);
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steamidParsed]);

  const onTabChange = (key: string) => {
    router.push(`/players/${steamid}?view=${key}`);
  };

  if (isLoading || data === null) {
    return (
      <>
        <Row justify={"center"} style={{ paddingTop: 30 }}>
          <Loading />
        </Row>
      </>
    );
  }

  if (!isLoading && error != null) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={"There was an error loading the player card. Try refreshing the page."}
          description={`${JSON.stringify(error)}`}
        />
      </Row>
    );
  }

  // This protects all the requests accessing data
  if (
    isLoading ||
    !data ||
    (data?.steamProfile && steamidParsed && data?.steamProfile[steamidParsed] === undefined)
  ) {
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
        <div style={{ paddingTop: 250, minHeight: "1500px" }}>
          <Loading />
        </div>
      );
    }
  }

  const steamProfile = data.steamProfile ? data.steamProfile[steamidParsed] : null;
  const playTime = data.playTime ? Math.floor(data.playTime / 60) : null;

  const relicData = data.relicPersonalStats;
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
          historicLeaderboardStats={data.playerInfo?.leaderboardStats}
        />
      ),
    },
    {
      label: "Recent Matches",
      key: "recentMatches",
      children: <LastMatchesTable steamID={`${steamidParsed}`} />,
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
            onChange={onTabChange}
          />
        </Col>
      </Row>
    </div>
  );
};

const PlayerCard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerCardContent />
    </Suspense>
  );
};

export default PlayerCard;

"use client";

import React from "react";
import { Card, Col, Row, Space, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";
import routes from "../../routes";
import { commanderAndBulletinDate, lastPatchName } from "@/config";
import RedditCard from "../../components/reddit/reddit-card";
import { RedditPost } from "@/utils/reddit";
import type { RelicLeaderboardResponse, LaddersDataObject } from "@/coh/types";
import { TopLeaderboard } from "./top-leaderboard";

// Import images
import chartImage from "../../../public/resources/chart.png";
import playerImage from "../../../public/resources/player.png";
import desktopAppImage from "../../../public/resources/desktop-app.png";
import commandersImage from "../../../public/resources/commanders.png";
import bulletinsImage from "../../../public/resources/bulletins.png";
import liveGamesImage from "../../../public/resources/live-games.webp";

const { Paragraph, Text } = Typography;

interface HomeContentProps {
  analyzedMatches: string;
  redditPosts: RedditPost[];
  leaderboardData: Record<
    string,
    {
      current: RelicLeaderboardResponse | null;
      historic: LaddersDataObject | null;
    }
  >;
}

export function HomeContent({ analyzedMatches, redditPosts, leaderboardData }: HomeContentProps) {
  const cardStyle = { width: 240, height: 240 };

  return (
    <Row>
      <Col span={23} xs={24}>
        <Row style={{ paddingTop: 10 }} justify={"center"}>
          <Col style={{ marginRight: 20 }}>
            <div style={{ textAlign: "center" }}>
              <Space style={{ display: "flex", marginBottom: 10, justifyContent: "center" }} wrap>
                <Link href={"/stats"} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="Game statistics"
                          src={chartImage}
                          style={{
                            maxHeight: 100,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Game Statistics"
                      description={
                        <>
                          Analyzed <b>{analyzedMatches}</b> matches. See{" "}
                          <b>winrate for each faction, map, team composition</b> and most used{" "}
                          <b>commanders</b> and <b>intel bulletins.</b>
                        </>
                      }
                    />
                  </Card>
                </Link>
                <Link href={"/players"} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="Player Cards"
                          src={playerImage}
                          style={{
                            maxHeight: 100,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Player Cards"
                      description={
                        <>
                          See any player card with <b>player standings</b> and all recent matches.
                          Includes <b>advanced match details</b> with unique stats and charts.
                        </>
                      }
                    />
                  </Card>
                </Link>
                <Link href={"/desktop-app"} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="Desktop App"
                          src={desktopAppImage}
                          style={{
                            maxHeight: 100,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Desktop App"
                      description={
                        <>
                          Get intel on your current games with <b>Desktop App</b>. See if players
                          are <b>playing in team</b>. What is their <b>rank</b> and much more!
                        </>
                      }
                    />
                  </Card>
                </Link>
              </Space>
              <Space style={{ marginBottom: 10, display: "flex", justifyContent: "center" }} wrap>
                <Link href={routes.commanderBase()} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 150,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="All commanders"
                          src={commandersImage}
                          style={{
                            maxHeight: 150,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Commanders"
                      description="See the list of all the commanders in the current patch of the game."
                    />
                  </Card>
                </Link>
                <Link href={routes.bulletinsBase()} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 150,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="All bulletins"
                          src={bulletinsImage}
                          style={{
                            maxHeight: 150,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Intel Bulletins"
                      description="See the list of all the intel bulletins in the current patch of the game."
                    />
                  </Card>
                </Link>
                <Link href={routes.liveMatchesBase()} prefetch={false}>
                  <Card
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 10 } }}
                    cover={
                      <div
                        style={{
                          height: 150,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          alt="Live games"
                          src={liveGamesImage}
                          style={{
                            maxHeight: 150,
                            objectFit: "contain",
                            width: "auto",
                            height: "auto",
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title="Live games"
                      description={
                        <>
                          See current <b>live games in progress</b> with player ranks.
                        </>
                      }
                    />
                  </Card>
                </Link>
              </Space>

              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <TopLeaderboard leaderboardData={leaderboardData} />
              </div>
            </div>
          </Col>
          <Col>
            <RedditCard width={550} data={redditPosts} />
          </Col>
        </Row>
        <Row justify={"center"} style={{ paddingTop: 10 }}>
          <Paragraph>
            Last patch data from <Text strong>{lastPatchName}</Text> extracted on{" "}
            <Text strong>{commanderAndBulletinDate}</Text>
          </Paragraph>
        </Row>
      </Col>
    </Row>
  );
}

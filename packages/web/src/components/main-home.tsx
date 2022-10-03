import React, { useEffect, useState } from "react";
import { Card, Col, Row, Space, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";
import routes from "../routes";
import { commanderAndBulletinDate, lastPatchName } from "../config";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import RedditCard from "./reddit/reddit-card";

const { Title, Paragraph, Text } = Typography;

const MainHome: React.FC = () => {
  const [analyzedMatches, setAnalyzedMatches] = useState(". . .");

  useEffect(() => {
    try {
      (async () => {
        const docRef = doc(getFirestore(), "stats", "global");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnalyzedMatches(docSnap.data()?.analyzedMatches.toLocaleString());
        }
      })();
    } catch (e) {
      console.error("Failed to get amount of analyzed matchess", e);
    }
  }, []);

  const cardStyle = { width: 240, height: 265 };

  return (
    <Row>
      <Col span={23} xs={24}>
        <Row style={{ paddingTop: 10 }} justify={"center"}>
          <Col style={{ marginRight: 20 }}>
            <div style={{ textAlign: "center" }}>
              <Space style={{ display: "flex", justifyContent: "center" }} wrap>
                <Link to={"/stats"}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        alt="Game statistics"
                        style={{ maxHeight: 110, objectFit: "contain" }}
                        src="/resources/chart.png"
                      />
                    }
                  >
                    <Meta
                      title="Game Statistics"
                      description={
                        <>
                          Analysis of all played matched. See{" "}
                          <b>winrate for each faction, map, team composition</b> and most used{" "}
                          <b>commanders</b> and <b>intel bulletins.</b>
                        </>
                      }
                    />
                  </Card>
                </Link>
                <Link to={"/players"}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        alt="Player Cards"
                        style={{ maxHeight: 110, objectFit: "contain" }}
                        src="/resources/player.png"
                      />
                    }
                  >
                    <Meta
                      title="Player Cards"
                      description={
                        <>
                          See any player card with <b>player standings</b> and all recent matches.
                          You can display <b>advanced match details</b> with never before seen
                          stats and chart visualization.
                        </>
                      }
                    />
                  </Card>
                </Link>
                <Link to={"/desktop-app"}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        alt="Desktop App"
                        style={{ maxHeight: 110, objectFit: "contain" }}
                        src="/resources/desktop-app.png"
                      />
                    }
                  >
                    <Meta
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
              <Title level={4}>So far analyzed {analyzedMatches} matches.</Title>
              <Space style={{ marginBottom: 10, display: "flex", justifyContent: "center" }} wrap>
                <Link to={routes.commanderBase()}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        style={{ maxHeight: 160, objectFit: "contain" }}
                        alt="All commanders"
                        src="/resources/commanders.png"
                      />
                    }
                  >
                    <Meta
                      title="Commanders"
                      description="See the list of all the commanders in the current patch of the game."
                    />
                  </Card>
                </Link>
                <Link to={routes.bulletinsBase()}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        style={{ maxHeight: 160, objectFit: "contain" }}
                        alt="All bulletins"
                        src="/resources/bulletins.png"
                      />
                    }
                  >
                    <Meta
                      title="Intel Bulletins"
                      description="See the list of all the intel bulletins in the current patch of the game."
                    />
                  </Card>
                </Link>
                <Link to={routes.liveMatchesBase()}>
                  <Card
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <img
                        style={{ maxHeight: 160, objectFit: "contain" }}
                        alt="All bulletins"
                        src="/resources/live-games.webp"
                      />
                    }
                  >
                    <Meta
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
              <Paragraph>
                Last patch data from <Text strong>{lastPatchName}</Text> extracted on{" "}
                <Text strong>{commanderAndBulletinDate}</Text>
              </Paragraph>
            </div>
          </Col>
          <Col>
            <RedditCard width={550} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default MainHome;

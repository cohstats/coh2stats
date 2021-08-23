import React from "react";
import { Card, Space, Typography } from "antd";
import { useData, useLoading } from "../firebase";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";
import routes from "../routes";
import { commanderAndBulletinDate, lastPatchName } from "../config";
const { Title, Paragraph, Text } = Typography;

const MainHome: React.FC = () => {
  const isLoading = useLoading("globalStats");
  const data: Record<string, any> = useData("globalStats");

  const analyzedMatches = isLoading ? ". . ." : data["analyzedMatches"].toLocaleString();

  return (
    <div style={{ textAlign: "center" }}>
      <Space style={{ padding: 10, display: "flex", justifyContent: "center" }} wrap>
        <Link to={"/stats"}>
          <Card
            hoverable
            style={{ width: 350, height: 375 }}
            cover={
              <img alt="Game statistics" width={350} height={150} src="/resources/chart.png" />
            }
          >
            <Meta
              title="Game Statistics"
              description="Daily analysis of played matches which provides answers for questions such as. What is the
               current winrate of each faction? What is the most played map? What are the most picked commanders and
               intel bulletins for each faction and more. With top 200 rank analysis you can spot how the pros do it in 1v1."
            />
          </Card>
        </Link>
        <Link to={"/players"}>
          <Card
            hoverable
            style={{ width: 350, height: 375 }}
            cover={<img alt="Player Cards" height={150} src="/resources/player.png" />}
          >
            <Meta
              title="Player Cards"
              description={
                <>
                  See any player card with <b>player standings</b> and all recent matches. You can
                  display <b>advanced match details</b> with never before seen stats and chart
                  visualization.
                </>
              }
            />
          </Card>
        </Link>
      </Space>
      <Title level={4}>So far analyzed {analyzedMatches} matches.</Title>
      <Space
        size={"large"}
        style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}
        wrap
      >
        <Link to={routes.commanderBase()}>
          <Card
            hoverable
            style={{ width: 280 }}
            cover={
              <img
                width={280}
                height={240}
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
            style={{ width: 280 }}
            cover={
              <img width={280} height={240} alt="All bulletins" src="/resources/bulletins.png" />
            }
          >
            <Meta
              title="Intel Bulletins"
              description="See the list of all the intel bulletins in the current patch of the game."
            />
          </Card>
        </Link>
      </Space>
      <Paragraph style={{ marginBottom: -4 }}>
        Last patch data from <Text strong>{lastPatchName}</Text> extracted on{" "}
        <Text strong>{commanderAndBulletinDate}</Text>
      </Paragraph>
    </div>
  );
};

export default MainHome;

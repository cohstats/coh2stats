import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useData, useLoading } from "../../firebase";
import { useFirestoreConnect } from "react-redux-firebase";
import { StatsCurrentLiveGames } from "../../coh/types";
import { Divider } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { Helper } from "../../components/helper";
const { Text } = Typography;

const LiveMatchesCard: React.FC = () => {
  // The connection of this data is done in root component useFirestoreConnect
  const isLoading = useLoading("liveMatchesStats");
  const data: StatsCurrentLiveGames = useData("liveMatchesStats");

  // @ts-ignore
  const timeStamp = isLoading ? "" : data?.timeStamp?.toDate().toLocaleString();

  return (
    <Card
      title={
        <div style={{ display: "flex" }}>
          <div>Current mp games in progress</div>
          <div style={{ marginLeft: "auto" }}>
            {timeStamp}{" "}
            <Helper
              text={
                "These overall stats are updated every 10 minutes. Counts only multiplayer games in progress. Total Players are unique filtered. Keep in mind that there " +
                "are probably a lot of players in lobby / searching / loading and doing other things."
              }
            />
          </div>
        </div>
      }
      loading={isLoading}
      size={"small"}
      style={{ width: "100%", maxWidth: 440, minHeight: 150 }}
    >
      <Row>
        <Col md={12} xs={24}>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>1 vs 1</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 70 }}>{data?.games["1v1"]} games</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["1v1"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>2 vs 2</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 70 }}>{data?.games["2v2"]} games</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["2v2"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>3 vs 3</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 70 }}>{data?.games["3v3"]} games</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["3v3"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>4 vs 4</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 70 }}>{data?.games["4v4"]} games</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["4v4"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={12} xs={24}>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: 45, textAlign: "left" }}>VS AI</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 75, paddingRight: 0 }}>
                  {data?.games["AI"]} games
                </div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["AI"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: 45, textAlign: "left" }}>Custom</div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 75, paddingRight: 0 }}>
                  {data?.games["custom"]} games
                </div>
                <div>
                  <Divider type="vertical" />
                </div>
                <div style={{ textAlign: "right", width: 50 }}>
                  {data?.players["custom"]} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex" }}>
                <div style={{ textAlign: "left", width: 155 }}>Total in automatch</div>

                <div style={{ textAlign: "right", marginLeft: "auto" }}>
                  {data?.totalPlayersAutomatch} <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex" }}>
                <div style={{ textAlign: "left", width: 155 }}>Total in any game</div>
                <div style={{ marginLeft: "auto" }}>
                  <Text strong>{data?.totalPlayersIngame}</Text> <TeamOutlined />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default LiveMatchesCard;

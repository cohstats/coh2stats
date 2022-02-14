import { DownloadOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row } from "antd";
import Link from "antd/lib/typography/Link";
import Title from "antd/lib/typography/Title";
import React from "react";
import AppVersionFile from "@coh2ladders/web/public/electron-app-version.json";

const DesktopApp: React.FC = () => {
  return (
    <>
      <Row justify="center" style={{ paddingTop: "20px" }}>
        <Col xs={24} xxl={17}>
          <Title level={2}>Coh2 Game Stats App</Title>
        </Col>
        <Col xs={24} xxl={17} style={{ textAlign: "center" }}>
          <img
            width={1920}
            style={{ maxWidth: "100%" }}
            alt="Desktop app displays stats on current loading game"
            src="resources/desktopAppImages/Hero.png"
          />
        </Col>
        <Col xs={24} xxl={17}>
          <Title>Gain additional intel on your games with the desktop app!</Title>
          <ul style={{ fontSize: "20px" }}>
            <li>Easy to use, no configuration required</li>
            <li>See detailed leaderboard stats of players in your game</li>
            <li>Updates automatically when joining a new game</li>
          </ul>
          <br />
          <p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              href={AppVersionFile.downloadLink}
            >
              Download {AppVersionFile.version}
            </Button>
          </p>
          <Link href={AppVersionFile.link} target="_blank">
            Release Notes
          </Link>
        </Col>
        <Col xs={24} xxl={17} style={{ paddingTop: "200px" }}>
          <Row>
            <Col span={8} style={{ paddingTop: 70 }}>
              <Title level={2}>Displays team detailed rankings</Title>
              <p style={{ fontSize: "20px" }}>
                When a player belongs to a team the team ranking will be displayed in the T Rank
                column. Select show team rankings to see a list of all teams with detailed
                leaderboard stats.
              </p>
            </Col>
            <Col span={16}>
              <Image
                width={"100%"}
                style={{ maxWidth: "100%" }}
                alt="Desktop app displays team rankings"
                src="resources/desktopAppImages/TeamRanking.png"
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} xxl={17} style={{ paddingTop: "200px" }}>
          <Row>
            <Col span={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays detailed player info for selected player"
                src="resources/desktopAppImages/DetailView.png"
              />
            </Col>
            <Col span={8} style={{ paddingTop: 70 }}>
              <Title level={2}>Easy access to player cards</Title>
              <p style={{ fontSize: "20px" }}>
                Select a player to open his player card either in a new window or in browser
                (depending on user settings).
              </p>
            </Col>
          </Row>
        </Col>
        <Col xs={24} xxl={17} style={{ paddingTop: "200px" }}>
          <Row>
            <Col span={8} style={{ paddingTop: 70 }}>
              <Title level={2}>Game Analysis</Title>
              <p style={{ fontSize: "20px" }}>
                View the average team level, average team win ratio, win ratio based on faction
                composition and victory chance probability below the player list.
              </p>
            </Col>
            <Col span={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays additional statistics on the current team compositions"
                src="resources/desktopAppImages/GameAnalysis.png"
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} xxl={17} style={{ paddingTop: "200px" }}>
          <Row>
            <Col span={16}>
              <Image
                width={"100%"}
                alt="Desktop app can be used in OBS to overlay player statistics on stream"
                src="resources/desktopAppImages/StreamerMode.png"
              />
            </Col>
            <Col span={8} style={{ paddingTop: 70 }}>
              <Title level={2}>Dynamic overlay for streamers with OBS</Title>
              <p style={{ fontSize: "20px" }}>
                An easy to configure overlay for OBS that shows the players and their ranking when
                in game.
              </p>
            </Col>
          </Row>
        </Col>
        <Col
          xs={24}
          xxl={17}
          style={{ textAlign: "center", paddingTop: "100px", paddingBottom: "200px" }}
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            href={AppVersionFile.downloadLink}
          >
            Download {AppVersionFile.version}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default DesktopApp;

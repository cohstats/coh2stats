import { DownloadOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import React, { useEffect, useRef } from "react";
import AppVersionFile from "@coh2stats/web/public/electron-app-version.json";
// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun: { (): void }) => useEffect(fun, []);

const DesktopApp: React.FC = () => {
  const twitchOverlayRef = useRef(null);
  const OBSOverlayRef = useRef(null);

  useMountEffect(() => {
    const hash = window.location.hash;
    if (hash === "#twitch-overlay" && twitchOverlayRef) {
      // @ts-ignore
      twitchOverlayRef.current.scrollIntoView();
    } else if (hash === "#obs-overlay" && OBSOverlayRef) {
      // @ts-ignore
      OBSOverlayRef.current.scrollIntoView();
    }
  }); // Scroll on mount

  return (
    <>
      <Row justify="center" style={{ paddingTop: "20px" }}>
        <Col xs={23} xxl={17}>
          <Title level={1}>COH2 Game Stats Desktop App</Title>
          <Row justify="center">
            <img
              width={1920}
              style={{ maxWidth: "100%" }}
              alt="Desktop app displays stats on current loading game"
              src="resources/desktopAppImages/Hero.png"
            />
          </Row>
          <Row justify={"center"}>
            <Col xl={14} xs={24}>
              <Title level={2}>Gain additional intel on your games with the desktop app!</Title>
              <ul style={{ fontSize: "20px" }}>
                <li>Easy to use, no configuration required - just start the app</li>
                <li>See detailed leaderboard stats of players in your game</li>
                <li>Game results prediction based on map analysis</li>
                <li>Loads automatically when joining a new game</li>
                <li>Twitch stream overlay extension</li>
                <li>Streamer mode with OBS support</li>
              </ul>
              <br />
            </Col>
            <Col xl={10} xs={24} style={{ textAlign: "center", paddingTop: 80 }}>
              <p>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  href={AppVersionFile.downloadLink}
                >
                  Download v{AppVersionFile.version}
                </Button>
              </p>
              <Link href={AppVersionFile.link} target="_blank">
                Release Notes
              </Link>
            </Col>
          </Row>
          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <Title level={2}>Displays detailed team rankings</Title>
              <p style={{ fontSize: "20px" }}>
                When a player belongs to a team, the team ranking will be displayed in the T Rank
                column. Select show team rankings to see a list of all teams with detailed
                leaderboard stats.
              </p>
            </Col>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                style={{ maxWidth: "100%" }}
                alt="Desktop app displays team rankings"
                src="resources/desktopAppImages/TeamRanking.png"
              />
            </Col>
          </Row>
          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays detailed player info for selected player"
                src="resources/desktopAppImages/DetailView.png"
              />
            </Col>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <Title level={2}>Easy access to player cards</Title>
              <p style={{ fontSize: "20px" }}>
                Select a player to open his player card either in a new window or in browser
                (depending on user settings).
              </p>
            </Col>
          </Row>
          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <Title level={2}>Game Analysis</Title>
              <p style={{ fontSize: "20px" }}>
                View the average team level, average team win ratio, win ratio based on faction
                composition and victory chance probability below the player list.
              </p>
            </Col>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays additional statistics on the current team compositions"
                src="resources/desktopAppImages/GameAnalysis.png"
              />
            </Col>
          </Row>
          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays detailed player info for selected player"
                src="resources/desktopAppImages/DarkMode.png"
              />
            </Col>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <Title level={2}>Light and Dark Mode</Title>
              <p style={{ fontSize: "20px" }}>
                Switch between light and dark mode in the apps settings.
              </p>
            </Col>
          </Row>

          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <div ref={twitchOverlayRef}>
                <a href={"#twitch-overlay"}>
                  <Title level={2}>Twitch Overlay Extension</Title>
                </a>
                <p style={{ fontSize: "20px" }}>
                  A expandable Stream Overlay that allows curious viewers to interact with your
                  game stats on stream. Check out the extension{" "}
                  <Link
                    href={"https://dashboard.twitch.tv/extensions/6x9q2nzzv9wewklo7gt7hz2vypdgg7"}
                    target="_blank"
                  >
                    here
                  </Link>
                  .
                </p>
              </div>
            </Col>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                alt="Desktop app displays additional statistics on the current team compositions"
                src="resources/desktopAppImages/TwitchExtension.png"
              />
            </Col>
          </Row>

          <Row justify="center" style={{ paddingTop: "40px" }}>
            <Col xs={24} xl={16}>
              <Image
                width={"100%"}
                alt="Desktop app can be used in OBS to overlay player statistics on stream"
                src="resources/desktopAppImages/StreamerMode.png"
              />
            </Col>
            <Col xs={24} xl={8} style={{ paddingTop: "70px" }}>
              <div ref={OBSOverlayRef}>
                <a href={"#obs-overlay"}>
                  <Title level={2}>Dynamic overlay for streamers with OBS</Title>
                </a>
              </div>
              <p style={{ fontSize: "20px" }}>
                An easy to configure overlay for OBS that shows the players and their ranking when
                in game. Learn more{" "}
                <Link
                  href={
                    "https://github.com/cohstats/coh2stats/blob/master/packages/app/README.md#stream-overlay"
                  }
                  target="_blank"
                >
                  here
                </Link>
                .
              </p>
            </Col>
          </Row>

          <Row justify="center" style={{ paddingTop: "20px" }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              href={AppVersionFile.downloadLink}
            >
              Download {AppVersionFile.version}
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default DesktopApp;

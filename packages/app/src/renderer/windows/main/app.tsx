import * as React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../../redux/slice";
import CurrentGameOverview from "../../features/current-game-overview";
import { firebaseInit } from "../../firebase/firebase";

import PlayerCount from "../../features/player-count";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Divider, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import StatusBar from "../../components/status-bar";

// We need to initialize our Firebase
// This has to happen once on the main file in the app
firebaseInit();

const App = (): JSX.Element => {
  const gameData = useSelector(selectGame);

  let content = (
    <>
      <CurrentGameOverview game={gameData} />
    </>
  );
  // show loader when not in game
  if (gameData.state === "closed" || gameData.state === "menu") {
    content = (
      <>
        <div style={{ textAlign: "center", paddingTop: 30, paddingBottom: 30 }}>
          <Title>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} /> Waiting for a
            game
          </Title>
        </div>
        {gameData.found ? (
          <>
            <Divider orientation="left">
              <Title level={3}>Last Game</Title>
            </Divider>
            <div>
              <CurrentGameOverview game={gameData} />
            </div>
          </>
        ) : null}
      </>
    );
  }

  return (
    <div>
      <StatusBar left={null} right={<PlayerCount />} />
      <Row justify="center" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <Col xs={24} md={22} xxl={14}>
          {content}
        </Col>
      </Row>
    </div>
  );
};

export default App;

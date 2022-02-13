import * as React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../../redux/slice";
import CurrentGameOverview from "../../features/current-game-overview";
import { events, firebaseInit } from "../../firebase/firebase";

import PlayerCount from "../../features/player-count";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import Spin from "antd/lib/spin";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Divider from "antd/lib/divider";
import Title from "antd/lib/typography/Title";
import StatusBar from "../../components/status-bar";
import { useEffect } from "react";

// We need to initialize our Firebase
// This has to happen once on the main file of each render process
firebaseInit();

const App = (): JSX.Element => {
  const gameData = useSelector(selectGame);

  // On init of the app
  useEffect(() => {
    events.init();
  }, []);

  let content = (
    <>
      <CurrentGameOverview game={gameData} />
    </>
  );
  // show loader when not in game
  if (gameData.state === "closed" || gameData.state === "menu") {
    content = (
      <>
        <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
          <Title>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} /> Waiting for a
            game
          </Title>
        </div>
        {gameData.found ? (
          <>
            <Divider orientation="left">
              <Title level={3}>Last Game - {gameData.map}</Title>
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
      <Row justify="center" style={{ paddingTop: "0px", paddingBottom: "20px" }}>
        <Col xs={24} md={22} xxl={14}>
          {content}
        </Col>
      </Row>
    </div>
  );
};

export default App;

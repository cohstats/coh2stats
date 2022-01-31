import { Col, Row, Spin } from "antd";
import React from "react";
import { GameData } from "../../redux/state";
import TeamView from "./team-view";

interface Props {
  game: GameData;
}

const CurrentGameOverview: React.FC<Props> = ({ game }) => {
  return (
    <div>
      <Row justify="center" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <Col xs={24} md={22} xxl={14}>
          {game.found ? (
            <>
              <TeamView side={game.left} />
              <h1>VS</h1>
              <TeamView side={game.right} />
            </>
          ) : (
            <>
              <h1>
                <Spin size="large" style={{ paddingRight: "20px" }} />
                Scanning for a Game
              </h1>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CurrentGameOverview;

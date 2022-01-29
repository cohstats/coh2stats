import { Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { LadderStats, GameData } from "../../redux/state";

interface Props {
  game: GameData;
}

const LoadingView: React.FC<Props> = ({ game }) => {
  const playerCard = (ladderStats: LadderStats, index: number) => (
    <Row key={ladderStats.members[0].relicID + "" + index} style={{ height: "190px" }}>
      <Col flex="140px"></Col>
      <Col flex="auto" style={{ paddingTop: "3px", paddingRight: "30px", textAlign: "right" }}>
        <Title level={4}>Rank {ladderStats.rank > 0 ? ladderStats.rank : "-"}</Title>
      </Col>
    </Row>
  );
  return (
    <>
      <Row style={{ paddingTop: "140px", paddingLeft: "100px", paddingRight: "100px" }}>
        <Col span={12} style={{ paddingRight: "280px" }}>
          {game.left.solo.map(playerCard)}
        </Col>
        <Col span={12} style={{ paddingLeft: "280px" }}>
          {game.right.solo.map(playerCard)}
        </Col>
      </Row>
    </>
  );
};

export default LoadingView;

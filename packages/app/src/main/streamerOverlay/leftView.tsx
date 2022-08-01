import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";
import Title from "antd/es/typography/Title";
import React from "react";
import { LadderStats, GameData } from "../../redux/state";
import { FactionIcon } from "./factionIcon";

interface Props {
  game: GameData;
}

const LeftView: React.FC<Props> = ({ game }) => {
  const shadowStyle = "1.5px 1.5px black";

  const renderMember = (ladderStats: LadderStats, index: number) => (
    <Row key={ladderStats.members[0].relicID + "" + index}>
      <Col flex="80px" style={{ textAlign: "center" }}>
        <Title level={4} style={{ textShadow: shadowStyle, marginBottom: "5px" }}>
          {ladderStats.rank > 0 ? ladderStats.rank : "-"}
        </Title>
      </Col>
      <Col flex="auto">
        <Title
          level={4}
          style={{ textShadow: shadowStyle, width: "280px", marginBottom: "5px" }}
          ellipsis
        >
          <FactionIcon
            faction={ladderStats.members[0].faction}
            ai={ladderStats.members[0].ai}
            style={{ width: "1.4em", height: "1.4em" }}
          />
          {ladderStats.members[0].name}
        </Title>
      </Col>
    </Row>
  );
  return (
    <>
      <Row style={{ paddingTop: "150px", paddingLeft: "15px" }}>
        <Col span={8}>
          {game.left.solo.map(renderMember)}
          <Row>
            <Col style={{ paddingLeft: "100px" }}>
              <Title level={2} style={{ textShadow: shadowStyle, marginBottom: "5px" }}>
                VS
              </Title>
            </Col>
          </Row>
          {game.right.solo.map(renderMember)}
        </Col>
      </Row>
    </>
  );
};

export default LeftView;

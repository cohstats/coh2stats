import { Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { GameData } from "../../redux/state";
import { FactionIcon } from "./factionIcon";

interface Props {
  game: GameData;
}

const CenterView: React.FC<Props> = ({ game }) => {
  const shadowStyle = "1.5px 1.5px black";
  return (
    <>
      <Row style={{ paddingTop: "35px" }}>
        <Col span={10} offset={7}>
          <Row>
            <Col span={12} style={{ paddingRight: "35px" }}>
              {game.left.solo.map((ladderStats, index) => (
                <Row key={ladderStats.members[0].relicID + "" + index}>
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
                  <Col flex="80px" style={{ textAlign: "center" }}>
                    <Title level={4} style={{ textShadow: shadowStyle, marginBottom: "5px" }}>
                      {ladderStats.rank > 0 ? ladderStats.rank : "-"}
                    </Title>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col span={12} style={{ paddingLeft: "35px" }}>
              {game.right.solo.map((ladderStats, index) => (
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
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CenterView;

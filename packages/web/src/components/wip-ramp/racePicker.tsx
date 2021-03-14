import React from "react";
import { Col, Row } from "antd";

import { useHistory } from "react-router";
import { RaceName } from "../../coh/types";
import routes from "../../routes";

export const RacePicker = () => {
  const { push } = useHistory();
  const myImageSize = "220px";

  let myCenterStyle = {
    justifyContent: "center",
    padding: "10px",
    height: myImageSize,
    cursor: "pointer",
  };

  function onRaceClick(race: RaceName) {
    push(routes.commanderList(race));
  }

  function getRaceImage(race: RaceName) {
    return `../resources/generalIcons/${race}.png`;
  }

  return (
    <>
      <div>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <div onClick={() => onRaceClick("wermacht")} style={myCenterStyle}>
              <img style={myCenterStyle} src={getRaceImage("wermacht")} width="inherit" />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("wgerman")} style={myCenterStyle}>
              <img style={myCenterStyle} src={getRaceImage("wgerman")} />
            </div>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <div onClick={() => onRaceClick("soviet")} style={myCenterStyle}>
              <img style={myCenterStyle} src={getRaceImage("soviet")} />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("british")} style={myCenterStyle}>
              <img style={myCenterStyle} src={getRaceImage("british")} />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("usf")} style={myCenterStyle}>
              <img style={myCenterStyle} src={getRaceImage("usf")} />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

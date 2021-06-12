import React from "react";
import { Col, Row } from "antd";

import { RaceName } from "../../coh/types";
import routes from "../../routes";
import { Link } from "react-router-dom";

export const RacePicker = () => {
  const myImageSize = "220px";

  let myCenterStyle = {
    justifyContent: "center",
    padding: "10px",
    height: myImageSize,
    cursor: "pointer",
  };

  function getRaceImage(race: RaceName) {
    return `/resources/generalIcons/${race}.png`;
  }

  return (
    <>
      <div>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link to={routes.commanderList("wermacht")}>
              <div style={myCenterStyle}>
                <img style={myCenterStyle} src={getRaceImage("wermacht")} alt="wermacht" />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("wgerman")}>
              <div style={myCenterStyle}>
                <img style={myCenterStyle} src={getRaceImage("wgerman")} alt="wgerman" />
              </div>
            </Link>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link to={routes.commanderList("soviet")}>
              <div style={myCenterStyle}>
                <img style={myCenterStyle} src={getRaceImage("soviet")} alt="soviet" />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("british")}>
              <div style={myCenterStyle}>
                <img style={myCenterStyle} src={getRaceImage("british")} alt="british" />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("usf")}>
              <div style={myCenterStyle}>
                <img style={myCenterStyle} src={getRaceImage("usf")} alt="usf" />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

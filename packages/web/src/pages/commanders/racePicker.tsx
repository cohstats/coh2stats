import React from "react";
import { Col, Row } from "antd";

import routes from "../../routes";
import { Link } from "react-router-dom-v5-compat";
import { Tip } from "../../components/tip";
import { getGeneralIconPath } from "../../coh/helpers";

const imageWidth = 220;
const imageHeight = 220;

export const RacePicker = () => {
  let myCenterStyle = {
    justifyContent: "center",
    padding: "10px",
  };

  return (
    <>
      <div>
        <div style={{ textAlign: "center", paddingTop: 10, fontSize: "larger" }}>
          <Tip
            text={
              <>
                You can see the most picked Commanders over at{" "}
                <Link to={routes.statsBase()}>stats page</Link>.
              </>
            }
          />
        </div>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link to={routes.commanderList("wermacht")}>
              <div style={myCenterStyle}>
                <img
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconPath("wermacht")}
                  alt="wermacht"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("wgerman")}>
              <div style={myCenterStyle}>
                <img
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconPath("wgerman")}
                  alt="wgerman"
                />
              </div>
            </Link>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <Link to={routes.commanderList("soviet")}>
              <div style={myCenterStyle}>
                <img
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconPath("soviet")}
                  alt="soviet"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("british")}>
              <div style={myCenterStyle}>
                <img
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconPath("british")}
                  alt="british"
                />
              </div>
            </Link>
          </Col>
          <Col flex="none">
            <Link to={routes.commanderList("usf")}>
              <div style={myCenterStyle}>
                <img
                  width={imageWidth}
                  height={imageHeight}
                  style={myCenterStyle}
                  src={getGeneralIconPath("usf")}
                  alt="usf"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

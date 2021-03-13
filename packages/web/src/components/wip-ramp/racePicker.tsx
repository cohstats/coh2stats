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

  return (
    <>
      <div>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <div onClick={() => onRaceClick("wermacht")} style={myCenterStyle}>
              <img
                style={myCenterStyle}
                src="https://coh2index.com/static/images/Icons_factions_faction_german_192.png"
                width="inherit"
              />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("wgerman")} style={myCenterStyle}>
              <img
                style={myCenterStyle}
                src="https://coh2index.com/static/images/Icons_factions_faction_west_german_192.png"
              />
            </div>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col flex="none">
            <div onClick={() => onRaceClick("soviet")} style={myCenterStyle}>
              <img
                style={myCenterStyle}
                src="https://coh2index.com/static/images/Icons_factions_faction_soviet_192.png"
              />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("british")} style={myCenterStyle}>
              <img
                style={myCenterStyle}
                src="https://coh2index.com/static/images/Icons_factions_faction_british_192.png"
              />
            </div>
          </Col>
          <Col flex="none">
            <div onClick={() => onRaceClick("usf")} style={myCenterStyle}>
              <img
                style={myCenterStyle}
                src="https://coh2index.com/static/images/Icons_factions_faction_aef_192.png"
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

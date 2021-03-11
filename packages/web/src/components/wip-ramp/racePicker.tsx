import React from "react";
import {
    Card,
    Col,
    Row,
    Image,
    List,
    Divider,
    Avatar,
    Descriptions,
    Badge,
    Space,
    Breadcrumb,
    Menu,
} from "antd";
import myBgnd from "/resources/commanderImage/placeholder.svg";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getCommanderByRaces, getCommanderData } from "../../coh/commanders";
import { useHistory, useParams } from "react-router";
import { RaceName } from "../../coh/types";

export const RacePicker = () => {
    const { push } = useHistory();
    const myImageSize = "220px";

    let myCenterStyle = {
        justifyContent: "center",
        padding: "10px",
        height: myImageSize,
        cursor: "pointer",
    };

    function onRaceClick(myRace: RaceName) {
        push(`commanders/${myRace}`);
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

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
import { CommanderData, RaceName } from "../../coh/types";
import { push } from "connected-react-router";

export const CommandersList = () => {
    const { push } = useHistory();

    const { race } = useParams<{
        race: string;
    }>();

    let myData = getCommanderByRaces(race as RaceName);
    myData = myData.filter((commanderData) => {
        return (
            commanderData["commanderName"] != "undefined" &&
            commanderData["description"] != "undefined"
        );
    });

    function getRaceBackground(activeRace: RaceName) {
        switch (activeRace) {
            case "wermacht":
                return "https://coh2index.com/static/images/Icons_factions_faction_german_192.png";
            case "wgerman":
                return "https://coh2index.com/static/images/Icons_factions_faction_west_german_192.png";
            case "soviet":
                return "https://coh2index.com/static/images/Icons_factions_faction_soviet_192.png";
            case "british":
                return "https://coh2index.com/static/images/Icons_factions_faction_british_192.png";
            case "usf":
                return "https://coh2index.com/static/images/Icons_factions_faction_aef_192.png";
            default:
                return "https://pbs.twimg.com/media/BpDH_NpCYAI1YE2.png";
        }
    }
    var divStyle = {
        backgroundImage: "url(" + getRaceBackground(race as RaceName) + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "400px",
        backgroundPosition: "left top",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(255,255,255,0.8)",
    };

    if (myData.length === 0) {
        return (
            <>
                <h1>Race {race} here was not found.</h1>
            </>
        );
    }

    function onCommanderClick(myServerID: string) {
        console.log(myServerID);
        console.log(`commanders/${race}/${myServerID}`);
        push(`${race}/${myServerID}`);
    }

    let styleCursorPointer = {
        cursor: "pointer",
    };

    return (
        <>
            <div style={divStyle}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <List
                            itemLayout="horizontal"
                            dataSource={myData}
                            renderItem={(item) => (
                                <div>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <div
                                                    style={styleCursorPointer}
                                                    onClick={() =>
                                                        onCommanderClick(item.serverID)
                                                    }
                                                >
                                                    <Avatar
                                                        src="/resources/commanderImage/placeholder.svg"
                                                        shape="square"
                                                        size={64}
                                                    />
                                                </div>
                                            }
                                            title={
                                                <div
                                                    style={styleCursorPointer}
                                                    onClick={() =>
                                                        onCommanderClick(item.serverID)
                                                    }
                                                >
                                                    {item.commanderName}
                                                </div>
                                            }
                                            description={item.description}
                                        />
                                    </List.Item>
                                </div>
                            )}
                        />
                    </Col>
                    <Col span={6}> </Col>
                </Row>
            </div>
        </>
    );
};

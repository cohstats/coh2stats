import React from "react";
import { Card, Col, Row, Image, List, Divider, Avatar, Descriptions, Badge } from "antd";
import myBgnd from "/resources/commanderImage/placeholder.svg";
import { ClockCircleOutlined } from "@ant-design/icons";

export const RampComponent = () => {

    let myData = {
        serverID: "186415",
        commanderName: "Armor Company",
        description:
            "Overwhelm the enemy with elite American armored vehicles and supporting infantry. Assault engineers can clear fortifications to allow vehicles to advance, while Sherman Bulldozers can be used to setup a roadblock or defensive line. The enemy\u2019s strongpoints can be bombarded with 240mm artillery prior to an attack.",
        races: ["usf"],
        abilities: [
            {
                reference: "commander_ability\\aef\\commander\\ability\\m10_deploy_clone",
                name: "M10 'Wolverine' Tank Destroyer",
                description:
                    "Deploy an M10 Tank Destroyer. The 'Wolverine's'' 3 inch main gun is effective against all but the heaviest enemy armored vehicles. Effective vs tanks and vehicles.",
            },
            {
                reference:
                    "commander_ability\\aef\\commander\\ability\\sherman_bulldozer_dispatch",
                name: "105mm Bulldozer Sherman",
                description:
                    "An M4A3 Sherman Bulldozer tank equipped with a 105mm howitzer for engaging infantry and structures can be called into the battlefield.",
            },
            {
                reference:
                    "commander_ability\\aef\\commander\\ability\\assault_engineer_dispatch",
                name: "Assault Engineers",
                description:
                    "An Assault Engineer Squad with short range sub machine guns can be ordered in to the battlefield.",
            },
            {
                reference: "commander_ability\\aef\\commander\\ability\\siege_240mm_artillery",
                name: "240mm Howitzer Barrage",
                description: "Call in a 240mm Howitzer barrage to level the target area.",
            },
            {
                reference: "commander_ability\\aef\\commander\\passive\\elite_vehicle_crews",
                name: "Elite Vehicle Crews Upgrade",
                description:
                    "Vehicle crews are upgraded with Thompson submachine guns, increased repair speeds and earn veterancy at an increased rate.",
            },
        ],
    };

    function ImageDemo() {
        return (
            <Image width={100} height={130} preview={false} src="/resources/commanderImage/placeholder.svg" />
        );
    }

    function ImageRace() {
        if ((myData.races[0] = "usf")) {
            return <Image width={350} preview={false} src="/resources/us-forces.png" />;
        } else {
            return (
                <Image
                    width={150}
                    preview={false}
                    src="/resources/commanderImage/placeholder.svg"
                />
            );
        }
    }

    const divStyle = {
        margin: '10px'
    };



    return (
        <>
            <Row gutter={[32, 32]}>
                <Col span={24}>
                </Col>
            </Row>

            <Row gutter={[16, 8]}>
                <Col span={2}></Col>
                <Col span={4}></Col>
                <Col flex="100px">


                    <div>
                    <img src="https://www.coh2.org/uploads/hosting/okw_icons/OKW_Special_Operations.jpg" width="100" height="130" />
                    </div>
                </Col>
                <Col span={10}>
                    <Descriptions title={myData.commanderName}>
                        <Descriptions.Item>{myData.description}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={6}></Col>
            </Row>
            <Divider />
            <Row gutter={[16, 8]}>
                <Col span={6}></Col>
                <Col span={12}>
                    <List
                        itemLayout="horizontal"
                        dataSource={myData.abilities}
                        renderItem={(item) => (
                            <div>
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div>
                                                <Avatar
                                                    src="/resources/commanderImage/placeholder.svg"
                                                    shape="square"
                                                    size={64}
                                                />
                                                <Badge count={5} overflowCount={999} showZero offset={[0, -32]}>
                                                    <a href="#" className="head-example" />
                                                </Badge>
                                            </div>
                                        }
                                        title={<a href="https://ant.design">{item.name}</a>}
                                        description={item.description}
                                    />
                                </List.Item>
                            </div>
                        )}
                    />
                </Col>
                <Divider />
                <Col span={6}></Col>
            </Row>
        </>
    );
};

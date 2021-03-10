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
import { getCommanderData } from "../../coh/commanders";
import { useParams } from "react-router";

export const RampComponent = () => {
    const { race, commanderID } = useParams<{
        race: string;
        commanderID: string;
    }>();

    const myData = getCommanderData(commanderID);

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="USA">
                    US Army
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="Wehrmacht">
                    Wehrmacht
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="Soviet">
                    Soviet
                </a>
            </Menu.Item>
        </Menu>
    );

    function ImageDemo() {
        return (
            <Image
                width={100}
                height={130}
                preview={false}
                src="/resources/commanderImage/placeholder.svg"
            />
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

    function toCapital(textIn: String) {
        return textIn.toUpperCase();
    }
    if (Object.keys(myData).length === 0 && myData.constructor === Object) {
        return (
            <>
                <h1>Commander ID {commanderID} was not found.</h1>
            </>
        );
    }

    return (
        <>
            <div>
                <Row>
                    <Col span={6}></Col>
                    <Col style={{ padding: "2vh" }} span={12}></Col>
                    <Col span={6}></Col>
                </Row>
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}></Col>
                    <Col style={{ padding: "0px 20px 0px 0px" }} flex="100px">
                        <img
                            src="https://www.coh2.org/uploads/hosting/okw_icons/OKW_Special_Operations.jpg"
                            width="130"
                            height="169"
                        />
                        <h2 style={{ textAlign: "center", margin: "-5px 0px 0px 0px" }}>
                            {myData.races[0].toUpperCase()}
                        </h2>
                    </Col>
                    <Col span={10}>
                        <h1>{myData.commanderName}</h1>
                        <Descriptions>
                            <Descriptions.Item>{myData.description}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={6}></Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <List
                            itemLayout="horizontal"
                            dataSource={myData.abilities}
                            renderItem={(item: Record<string, any>) => (
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
                                                    <Badge
                                                        count={5}
                                                        overflowCount={999}
                                                        showZero
                                                        offset={[0, -32]}
                                                    >
                                                        <a href="#" className="head-example" />
                                                    </Badge>
                                                </div>
                                            }
                                            title={item.name}
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
            </div>
        </>
    );
};

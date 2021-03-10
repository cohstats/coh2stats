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
import { useParams } from "react-router";

export const RacePicker = () => {
    return (
        <>
            <div>
                <Row>
                    <Col span={6}> </Col>
                    <Col span={12}>
                        <h1> RACE PICKER </h1>
                    </Col>
                    <Col span={6}> </Col>
                </Row>
            </div>
        </>
    );
};

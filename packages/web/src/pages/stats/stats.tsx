import React from "react";
import { Row, Col, Card, Tabs } from "antd";
import { useData, useLoading } from "../../firebase";
import { ResponsiveBar } from "@nivo/bar";
import { Loading } from "../../components/loading";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";

const { TabPane } = Tabs;

const Stats: React.FC = () => {
    const isLoading = useLoading("stats");
    const data: Record<string, any> = useData("stats");

    if (isLoading) return <Loading />;

    console.log(data);

    const type = "3v3";
    const specificData: Record<string, any> = data[type];
    const maps: Record<string, number> = specificData["maps"];

    const chart = MapBarChart(maps);

    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" key="2">
                <>
                    <Row>
                        <Col span={24}>{chart}</Col>
                        <Col span={24}>{WinsChart(specificData)}</Col>
                    </Row>
                    <Row>
                        <Col span={12}>col-12 gfhfdghgdfh</Col>
                        <Col span={12}>col-12</Col>
                    </Row>
                    <Row>
                        <Col span={8}>col-8</Col>
                        <Col span={8}>col-8</Col>
                        <Col span={8}>col-8</Col>
                    </Row>
                    <Row>
                        <Col span={6}>col-6</Col>
                        <Col span={6}>col-6</Col>
                        <Col span={6}>col-6</Col>
                        <Col span={6}>col-6</Col>
                    </Row>
                </>
            </TabPane>
            <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
            </TabPane>
        </Tabs>
    );
};

export default Stats;

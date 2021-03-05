import React from "react";
import { Row, Col, Card, Tabs, Radio, RadioChangeEvent } from "antd";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";
import { WinRateChart } from "../../components/charts/winRate-bar";
import { useHistory, useParams } from "react-router";

const Stats: React.FC = () => {
    const isLoading = useLoading("stats");
    const data: Record<string, any> = useData("stats");
    const { push } = useHistory();

    const { frequency, timestamp, type } = useParams<{
        frequency: string;
        timestamp: string;
        type: string;
    }>();

    if (isLoading) return <Loading />;

    console.log(data);

    const specificData: Record<string, any> = data[type];
    const maps: Record<string, number> = specificData["maps"];

    const onTypeRadioChange = (e: RadioChangeEvent) => {
        push(`/stats/daily/424234/${e.target?.value}`);
    };

    return (
        <>
            <Row justify={"center"}>
                <Radio.Group
                    defaultValue={type}
                    buttonStyle="solid"
                    onChange={onTypeRadioChange}
                    size={"large"}
                >
                    <Radio.Button value="general">General </Radio.Button>
                    <Radio.Button value="1v1">1 vs 1</Radio.Button>
                    <Radio.Button value="2v2">2 vs 2</Radio.Button>
                    <Radio.Button value="3v3">3 vs 3</Radio.Button>
                    <Radio.Button value="4v4">4 vs 4</Radio.Button>
                </Radio.Group>
            </Row>
            <Row justify={"center"}>
                <Col span={12}>Games Played{WinsChart(specificData)}</Col>

                <Col span={12}>Winrate{WinRateChart(specificData)}</Col>
            </Row>
            <Row justify={"center"}>
                <Col span={24}>{MapBarChart(maps)}</Col>
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
    );
};

export default Stats;

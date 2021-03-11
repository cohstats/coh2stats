import React from "react";
import { Row, Col, Card, Tabs, Radio, RadioChangeEvent, Tooltip } from "antd";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";
import { WinRateChart } from "../../components/charts/winRate-bar";
import { useHistory, useParams } from "react-router";
import { CommandersBarChart } from "../../components/charts/commanders-bar";
import { BulletinsBarChart } from "../../components/charts/bulletins-bar";
import { Helper } from "../../components/helper";
import Title from "antd/es/typography/Title";

const StatsDetails: React.FC = () => {
    const isLoading = useLoading("stats");
    const data: Record<string, any> = useData("stats");
    const { push } = useHistory();

    const { frequency, timestamp, type, race } = useParams<{
        frequency: string;
        timestamp: string;
        type: string;
        race: string;
    }>();

    if (isLoading) return <Loading />;

    console.log(data);

    const specificData: Record<string, any> = data[type];
    const maps: Record<string, number> = specificData["maps"];

    const onTypeRadioChange = (e: RadioChangeEvent) => {
        push(`/stats/daily/424234/${e.target?.value}/${race}`);
    };

    const onRaceRadioChange = (e: RadioChangeEvent) => {
        push(`/stats/daily/424234/${type}/${e.target?.value}`);
    };

    return (
        <>
            <Row justify={"center"}>
                <Radio.Group
                    defaultValue={type}
                    buttonStyle="solid"
                    onChange={onTypeRadioChange}
                    size={"large"}
                    style={{ padding: 20 }}
                >
                    <Radio.Button value="general">General </Radio.Button>
                    <Radio.Button value="1v1">1 vs 1</Radio.Button>
                    <Radio.Button value="2v2">2 vs 2</Radio.Button>
                    <Radio.Button value="3v3">3 vs 3</Radio.Button>
                    <Radio.Button value="4v4">4 vs 4</Radio.Button>
                </Radio.Group>
            </Row>
            <Row justify={"center"}>
                <Title level={4}>
                    Amount of games for this analysis {`${specificData["matchCount"]}`}
                </Title>
            </Row>
            <Row justify={"center"}>
                <Col span={12}>
                    <Card title={`Games Played ${type}`} style={{ width: 550, height: 600 }}>
                        {WinsChart(specificData)}
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title={`Winrate ${type}`} style={{ width: 550, height: 600 }}>
                        {WinRateChart(specificData)}
                    </Card>
                </Col>
            </Row>
            <Row align="middle">
                <Col span={1} />
                <Col span={22}>
                    <Card title={`Maps ${type}`} style={{ width: 1200, height: 700 }}>
                        {MapBarChart(maps)}
                    </Card>
                </Col>
                <Col span={1} />
            </Row>
            <Row justify={"center"}>
                <Radio.Group
                    defaultValue={race}
                    buttonStyle="solid"
                    onChange={onRaceRadioChange}
                    size={"large"}
                    style={{ padding: 20 }}
                >
                    <Radio.Button value="wermacht">Wermacht</Radio.Button>
                    <Radio.Button value="wgerman">WGerman</Radio.Button>
                    <Radio.Button value="usf">USF</Radio.Button>
                    <Radio.Button value="british">British</Radio.Button>
                    <Radio.Button value="soviet">Soviet</Radio.Button>
                </Radio.Group>
            </Row>
            <Row justify={"center"}>
                <Col span={1} />
                <Col span={11}>
                    <Card
                        title={
                            <span>
                                {`Commanders `}
                                <Helper
                                    text={
                                        "We are not able to " +
                                        "get picked commander in the match. This represents only commanders which player " +
                                        "had available when he loaded into the match."
                                    }
                                />
                                {` ${type} - ${race}`}
                            </span>
                        }
                        style={{ width: 850, height: 900 }}
                    >
                        {CommandersBarChart(specificData["commanders"][race])}
                    </Card>
                </Col>
                <Col span={11}>
                    <Card
                        title={`Intel Bulletins  ${type} - ${race}`}
                        style={{ width: 850, height: 900 }}
                    >
                        {BulletinsBarChart(specificData["intelBulletins"][race])}
                    </Card>
                </Col>
                <Col span={1} />
            </Row>
        </>
    );
};

export default StatsDetails;

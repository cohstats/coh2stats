import React from "react";
import { Row, Card, Radio, RadioChangeEvent, Space, Typography } from "antd";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";
import { WinRateChart } from "../../components/charts/winRate-bar";
import { useHistory, useParams } from "react-router";
import { CommandersBarChart } from "../../components/charts/commanders-bar";
import { BulletinsBarChart } from "../../components/charts/bulletins-bar";
import { Helper } from "../../components/helper";
import routes from "../../routes";
import { validStatsTypes } from "../../coh/types";
import { statsBase } from "../../titles";
import { capitalize } from "../../helpers";
import { useLocation } from "react-router-dom";
import { FactionVsFactionCard } from "./factions";

const { Title, Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StatsDetails: React.FC = () => {
  const isLoading = useLoading("stats");
  const data: Record<string, any> = useData("stats");
  const { push } = useHistory();
  const query = useQuery();
  const statsSource: string | null = query.get("statsSource") ? query.get("statsSource") : "";
  const sourceIsAll = statsSource !== "top200";

  const { frequency, timestamp, type, race } = useParams<{
    frequency: string;
    timestamp: string;
    type: string;
    race: string;
  }>();

  // Page title
  React.useEffect(() => {
    // Set page title
    if (!document.title.includes(type) || !document.title.includes(race)) {
      document.title = `${statsBase} - ${capitalize(race)} - ${type}`;
    }
  }, [type, race]);

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <Title level={4} style={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
        We are currently not tracking any records for the {`${frequency}`} stats on timestamp{" "}
        {`${timestamp}`}. <br />
        The statistics are run after the end of the day/week/month ~2AM UTC time.
      </Title>
    );
  }

  if (!validStatsTypes.includes(type) || !data[type]) {
    return (
      <Title level={4}>
        Unknown stats type {`${type}`}, valid values are {`${validStatsTypes}`}
      </Title>
    );
  }

  const specificData: Record<string, any> = data[type];

  const maps: Record<string, number> = specificData["maps"];

  const onTypeRadioChange = (e: RadioChangeEvent) => {
    push({
      pathname: routes.fullStatsDetails(frequency, timestamp, e.target?.value, race),
      // @ts-ignore
      search: `?${new URLSearchParams({ statsSource: statsSource }).toString()}`,
    });
  };

  const onRaceRadioChange = (e: RadioChangeEvent) => {
    push({
      pathname: routes.fullStatsDetails(frequency, timestamp, type, e.target?.value),
      // @ts-ignore
      search: `?${new URLSearchParams({ statsSource: statsSource }).toString()}`,
    });
  };

  return (
    <>
      <Row justify={"center"}>
        <Radio.Group
          defaultValue={type}
          buttonStyle="solid"
          onChange={onTypeRadioChange}
          size={"large"}
          style={{ paddingBottom: 10 }}
        >
          <Radio.Button disabled={true} value="general">
            General{" "}
          </Radio.Button>
          <Radio.Button value="1v1">1 vs 1</Radio.Button>
          <Radio.Button value="2v2">2 vs 2</Radio.Button>
          <Radio.Button value="3v3">3 vs 3</Radio.Button>
          <Radio.Button value="4v4">4 vs 4</Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify={"center"} style={{ paddingBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Amount of games for this analysis {`${specificData["matchCount"]}`}
          </span>
          <br />
          <span>
            {sourceIsAll && (
              <>
                This does not include all games which were played. See about page to understand
                the scope
                <br />
              </>
            )}
            {specificData["matchCount"] < 2000 && (
              <>
                This analysis has <Text strong>low amount of matches</Text>. The results might not
                be precise.
              </>
            )}
          </span>
        </div>
      </Row>
      <Row justify={"center"}>
        <Space size={"large"} wrap>
          <Card title={`Games Played ${type}`} style={{ width: 485, height: 500 }}>
            <WinsChart data={specificData} />
          </Card>
          <Card title={`Winrate ${type}`} style={{ width: 485, height: 500 }}>
            {WinRateChart(specificData)}
          </Card>
        </Space>
      </Row>
      <Row justify={"center"}>
        <FactionVsFactionCard
          title={`Team composition matrix ${type}`}
          data={specificData}
          style={{ marginTop: 20 }}
        />
      </Row>
      <Row justify={"center"}>
        <Card title={`Maps ${type}`} style={{ width: 1200, height: 700, marginTop: 20 }}>
          {MapBarChart(maps)}
        </Card>
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
        <Space size={"large"} wrap>
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
            style={{ width: 800, height: 900 }}
          >
            {CommandersBarChart(specificData["commanders"][race], push)}
          </Card>

          <Card title={`Intel Bulletins  ${type} - ${race}`} style={{ width: 800, height: 900 }}>
            {BulletinsBarChart(specificData["intelBulletins"][race])}
          </Card>
        </Space>
      </Row>
    </>
  );
};

export default StatsDetails;

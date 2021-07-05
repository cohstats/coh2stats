import React, { useEffect } from "react";
import { Row, Card, Radio, RadioChangeEvent, Space, Typography } from "antd";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";
import { WinRateChart } from "../../components/charts/winRate-bar";
import { useHistory } from "react-router";
import { CommandersBarChart } from "../../components/charts/commanders-bar";
import { BulletinsBarChart } from "../../components/charts/bulletins-bar";
import { Helper } from "../../components/helper";
import { statsBase } from "../../titles";
import { capitalize } from "../../helpers";
import { useLocation } from "react-router-dom";
import { FactionVsFactionCard } from "./factions";

const { Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface IProps {
  urlChanger: Function;
  specificData: Record<string, any>;
}

const CustomStatsDetails: React.FC<IProps> = ({ urlChanger, specificData }) => {
  const { push } = useHistory();
  const query = useQuery();

  const type = query.get("type") || "4v4";
  const race = query.get("race") || "wermacht";
  const sourceIsAll = query.get("statsSource") !== "top200";

  const data = specificData["generalData"];
  const mapsData = specificData["mapsData"];

  // Page title
  useEffect(() => {
    // Set page title
    if (!document.title.includes(type) || !document.title.includes(race)) {
      document.title = `${statsBase} - ${capitalize(race)} - ${type}`;
    }
  }, [type, race]);

  const onTypeRadioChange = (e: RadioChangeEvent) => {
    urlChanger({
      typeToLoad: e.target?.value,
    });
  };

  const onRaceRadioChange = (e: RadioChangeEvent) => {
    urlChanger({
      raceToLoad: e.target?.value,
    });
  };

  const TypeSelector = ({ style }: { style: Record<string, any> }) => {
    return (
      <Radio.Group
        defaultValue={type}
        buttonStyle="solid"
        onChange={onTypeRadioChange}
        size={"large"}
        style={{ ...{ paddingBottom: 10 }, ...style }}
      >
        <Radio.Button disabled={true} value="general">
          General{" "}
        </Radio.Button>
        <Radio.Button value="1v1">1 vs 1</Radio.Button>
        <Radio.Button value="2v2">2 vs 2</Radio.Button>
        <Radio.Button value="3v3">3 vs 3</Radio.Button>
        <Radio.Button value="4v4">4 vs 4</Radio.Button>
      </Radio.Group>
    );
  };

  const raceSelector = (style = {}) => {
    return (
      <Radio.Group
        defaultValue={race}
        buttonStyle="solid"
        onChange={onRaceRadioChange}
        size={"large"}
        style={{ ...{ padding: 20 }, ...style }}
      >
        <Radio.Button value="wermacht">Wehrmacht</Radio.Button>
        <Radio.Button value="wgerman">WGerman</Radio.Button>
        <Radio.Button value="usf">USF</Radio.Button>
        <Radio.Button value="british">British</Radio.Button>
        <Radio.Button value="soviet">Soviet</Radio.Button>
      </Radio.Group>
    );
  };

  return (
    <>
      <Row justify={"center"}>
        <TypeSelector style={{ paddingLeft: 0 }} />
      </Row>
      <Row justify={"center"} style={{ paddingBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Amount of games for this analysis {`${data["matchCount"]}`}
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
            {data["matchCount"] < 2000 && (
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
            <WinsChart data={data} />
          </Card>
          <Card title={`Winrate ${type}`} style={{ width: 485, height: 500 }}>
            <WinRateChart data={data} />
          </Card>
        </Space>
      </Row>
      <Row justify={"center"}>
        <FactionVsFactionCard
          title={`Team composition matrix ${type}`}
          data={data}
          style={{ marginTop: 40 }}
        />
      </Row>
      <Row justify={"center"}>
        <Card title={`Maps ${type}`} style={{ width: 1200, height: 700, marginTop: 20 }}>
          <MapBarChart maps={mapsData} />
        </Card>
      </Row>
      <Row justify={"center"}>{raceSelector({ paddingLeft: 0, paddingRight: 0 })}</Row>
      <Row justify={"center"}>
        <TypeSelector style={{ paddingLeft: 0 }} />
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
            {CommandersBarChart(data["commanders"][race], push)}
          </Card>

          <Card title={`Intel Bulletins  ${type} - ${race}`} style={{ width: 800, height: 900 }}>
            <BulletinsBarChart bulletins={data["intelBulletins"][race]} />
          </Card>
        </Space>
      </Row>
    </>
  );
};

export default CustomStatsDetails;

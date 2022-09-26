import React from "react";
import { Row, Card, Radio, RadioChangeEvent, Space } from "antd";
import { MapBarChart } from "../../components/charts/maps-bar";
import { WinsChart } from "../../components/charts/wins-bar";
import { WinRateChart } from "../../components/charts/winRate-bar";
import { useHistory } from "react-router";
import { CommandersBarChart } from "../../components/charts/commanders-bar";
import { Helper } from "../../components/helper";
import { FactionVsFactionCard } from "../../components/factions";
import { useMediaQuery } from "react-responsive";
import { PlayTimeHistogram } from "../../components/charts/map-stats/play-time-histogram";
import { TypeAnalysisObject } from "../../coh/types";
import { useQuery } from "../../utils/helpers";
import BulletinCard from "./components/bulletin-card";

interface IProps {
  urlChanger: Function;
  specificData: {
    generalData: TypeAnalysisObject;
  };
}

const CustomStatsDetails: React.FC<IProps> = ({ urlChanger, specificData }) => {
  const { push } = useHistory();
  const query = useQuery();
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  const type = query.get("type") || "4v4";
  const race = query.get("race") || "wermacht";

  const data = specificData.generalData;

  if (!data) {
    return <></>;
  }

  const mapsData = data["maps"];

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
        style={{ ...{ paddingBottom: 0 }, ...style }}
      >
        <Radio.Button value="general">General</Radio.Button>
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
        style={{ padding: 20, ...style }}
      >
        <Radio.Button value="wermacht">Wehrmacht</Radio.Button>
        <Radio.Button value="wgerman">WGerman</Radio.Button>
        <Radio.Button value="usf">USF</Radio.Button>
        <Radio.Button value="british">British</Radio.Button>
        <Radio.Button value="soviet">Soviet</Radio.Button>
      </Radio.Group>
    );
  };

  const RegularStatsCards = (props: {
    title:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
    children:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
  }) => {
    return (
      <Card
        title={props.title}
        bodyStyle={
          isMobile
            ? { width: "90vw", maxWidth: 480, height: 300 }
            : { width: "48vw", maxWidth: 480, height: 410 }
        }
      >
        {props.children}
      </Card>
    );
  };

  return (
    <>
      <Row justify={"center"} style={{ paddingTop: 10 }}>
        <Space size={"large"} wrap style={{ display: "flex", justifyContent: "center" }}>
          <RegularStatsCards title={`Games Analyzed ${type}`}>
            <WinsChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={`Faction winrate ${type}`}>
            <WinRateChart data={data} />
          </RegularStatsCards>
        </Space>
      </Row>
      {!isMobile && (
        <Row justify={"center"}>
          <FactionVsFactionCard
            title={`Team composition matrix ${type}`}
            data={data}
            style={{ marginTop: 20 }}
          />
        </Row>
      )}
      <Row justify={"center"} style={{ paddingTop: 20 }}>
        <Space size={"large"} wrap style={{ display: "flex", justifyContent: "center" }}>
          <RegularStatsCards title={`Game time ${type}`}>
            <PlayTimeHistogram data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={`Maps ${type}`}>
            <MapBarChart maps={mapsData} />
          </RegularStatsCards>
        </Space>
      </Row>
      <Row justify={"center"}>{raceSelector({ paddingLeft: 0, paddingRight: 0 })}</Row>
      <Row justify={"center"}>
        <TypeSelector style={{ paddingLeft: 0 }} />
      </Row>
      <Row justify={"center"} style={{ paddingTop: 20 }}>
        <Space size={"large"} style={{ display: "flex", justifyContent: "center" }} wrap>
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
            bodyStyle={isMobile ? { width: "90vw", height: 600 } : { width: 800, height: 900 }}
          >
            <CommandersBarChart commanders={data.commanders[race as "soviet"]} push={push} />
          </Card>
          <BulletinCard
            data={data}
            race={race}
            type={type}
            bodyStyle={isMobile ? { width: "90vw", height: 1200 } : { width: 800, height: 900 }}
          />
        </Space>
      </Row>
    </>
  );
};

export default CustomStatsDetails;

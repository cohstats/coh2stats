import React, { useEffect } from "react";
import { Row, Card, Radio, RadioChangeEvent, Space, Typography, Tooltip, Select } from "antd";
import { MapBarChart } from "../../components/charts/maps-bar";
import { mapStatsBase } from "../../titles";
import { useLocation } from "react-router-dom";
import { FactionVsFactionCard } from "../../components/factions";
import { useMediaQuery } from "react-responsive";
import { MapsWinRateChart } from "../../components/charts/map-stats/maps-winrate-bar";
import { MapsFactionWinRateChart } from "../../components/charts/map-stats/maps-winrate-faction-bar";
import { MapsPlayTime } from "../../components/charts/map-stats/maps-playtime-bar";
import { MapsWinRateSqrtChart } from "../../components/charts/map-stats/maps-winrate-sqrt-root-bar";
import { Helper } from "../../components/helper";
import { PlayTimeHistogram } from "../../components/charts/map-stats/play-time-histogram";
import { MapsPlayTimeHistogramStacked } from "../../components/charts/map-stats/maps-playtime-histogram-stacked";
import PatchNotification from "../../components/patch-notifications";

const { Text, Link } = Typography;
const { Option } = Select;

const MapSelectorComponent: React.FC<{
  map: string;
  data: Record<string, any>;
  changer: Function;
}> = ({ map, data, changer }) => {
  const mapNames = Object.keys(data).sort().reverse();

  return (
    <Select
      showSearch
      filterOption={(input, option) => {
        return option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      defaultValue={map}
      onChange={(value) => {
        changer({
          mapToLoad: value,
        });
      }}
      style={{ width: 250 }}
      size={"large"}
    >
      {mapNames.map((mapName) => {
        return (
          <Option key={mapName} value={mapName}>
            {mapName}
          </Option>
        );
      })}
    </Select>
  );
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface IProps {
  urlChanger: Function;
  specificData: Record<string, any>;
}

const MapStatsDetails: React.FC<IProps> = ({ urlChanger, specificData }) => {
  const query = useQuery();
  const isMobile = useMediaQuery({ query: "(max-width: 920px)" });

  const type = query.get("type") || "4v4";

  const timestamp = query.get("timeStamp") || "";
  const fromTimeStamp = query.get("fromTimeStamp") || "";
  const toTimeStamp = query.get("toTimeStamp") || "";
  const frequency = query.get("range") || "";
  let map = query.get("map") || "8p_redball_express";

  const data = specificData;
  let amountOfGames = 0;

  const mapData: Record<string, number> = {};

  for (const [mapName, mapValue] of Object.entries(data)) {
    mapData[mapName] = mapValue.matchCount;
    amountOfGames += mapValue.matchCount;
  }

  // Page title
  useEffect(() => {
    // Set page title
    if (!document.title.includes(type)) {
      document.title = `${mapStatsBase} - ${type}`;
    }
  }, [type]);

  const onTypeRadioChange = (e: RadioChangeEvent) => {
    urlChanger({
      typeToLoad: e.target?.value,
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
        <Radio.Button value="1v1">1 vs 1</Radio.Button>
        <Radio.Button value="2v2">2 vs 2</Radio.Button>
        <Radio.Button value="3v3">3 vs 3</Radio.Button>
        <Radio.Button value="4v4">4 vs 4</Radio.Button>
      </Radio.Group>
    );
  };

  const cardWidth = 510;
  const cardHeight = 420;

  return (
    <>
      <Row justify={"center"}>
        <TypeSelector style={{ paddingLeft: 0 }} />
      </Row>
      <Row justify={"center"}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Amount of games for this analysis {amountOfGames}
          </span>
          <br />
          <span>
            {
              <>
                This does not include all games which were played. See about page to understand
                the scope
                <br />
              </>
            }
            {amountOfGames < 2000 && (
              <>
                This analysis has <Text strong>low amount of matches</Text>. The results might not
                be precise.
              </>
            )}
          </span>
        </div>
      </Row>
      <Row justify={"center"}>
        <Tooltip
          title={
            frequency !== "range"
              ? "It's possible that there are multiple patches in this analysis. Use custom range to display all patches."
              : ""
          }
        >
          <Text strong>This analysis includes games from these patches:</Text>
        </Tooltip>
      </Row>
      <PatchNotification
        params={{
          unixTimeStamp: timestamp,
          unixTimeStampFrom: fromTimeStamp,
          unixTimeStampTo: toTimeStamp,
        }}
      />
      <Row justify={"center"} style={{ paddingTop: 10 }}>
        <Space size={"large"} wrap style={{ display: "flex", justifyContent: "center" }}>
          <Card
            title={`Win rate Axis vs Allies - diff ${type}`}
            bodyStyle={
              isMobile
                ? { width: "90vw", height: 300 }
                : { width: "48vw", maxWidth: cardWidth, height: cardHeight }
            }
          >
            <MapsWinRateChart data={data} />
          </Card>
          <Card
            title={`Games Played ${type}`}
            bodyStyle={
              isMobile
                ? { width: "90vw", height: 300 }
                : { width: "48vw", maxWidth: cardWidth, height: cardHeight }
            }
          >
            <MapBarChart maps={mapData} />
          </Card>
        </Space>
      </Row>
      <Row justify={"center"} style={{ paddingTop: 40 }}>
        <Space size={"large"} wrap style={{ display: "flex", justifyContent: "center" }}>
          <Card
            title={
              <>
                <span>{`Win rate deviation ${type}`}</span>{" "}
                <Helper
                  text={
                    <>
                      <b>The lesser the more balanced map for all factions.</b> It shows the
                      difference from 50% Win Rate for all factions on the map. It's calculated
                      using{" "}
                      <Link
                        href={"https://en.wikipedia.org/wiki/Root_mean_square"}
                        target="_blank"
                      >
                        RMS formula.
                      </Link>{" "}
                      RMS = Sqrt[ (1/5) * Sum of (winrate% - 50%)^2 ]
                    </>
                  }
                />
              </>
            }
            bodyStyle={
              isMobile
                ? { width: "90vw", height: 300 }
                : { width: "48vw", maxWidth: cardWidth, height: cardHeight }
            }
          >
            <MapsWinRateSqrtChart data={data} />
          </Card>
          <Card
            title={
              <>
                <span>{`Average playtime ${type}`}</span>{" "}
                <Helper
                  text={
                    "We started measuring playtime from 21st of September 2021. Including days in custom range " +
                    "before this date can give you inaccurate results."
                  }
                />
              </>
            }
            bodyStyle={
              isMobile
                ? { width: "90vw", height: 300 }
                : { width: "48vw", maxWidth: cardWidth, height: cardHeight }
            }
          >
            <MapsPlayTime data={data} average={true} />
          </Card>
        </Space>
      </Row>
      {!isMobile && (
        <>
          <Row justify={"center"}>
            <Card
              title={`Winrate diff per factions on maps ${type}`}
              style={{ marginTop: 40 }}
              bodyStyle={isMobile ? { width: "90vw", height: 300 } : { width: 1155, height: 650 }}
            >
              <MapsFactionWinRateChart data={data} />
            </Card>
          </Row>
          <Row justify={"center"} style={{ paddingTop: 40 }}>
            <Space direction={"vertical"}>
              <MapSelectorComponent data={data} map={map} changer={urlChanger} />
              <FactionVsFactionCard
                title={`${map} - ${type} team composition matrix`}
                data={data[map]}
                style={{ marginTop: 10, width: 1155 }}
              />
            </Space>
          </Row>
        </>
      )}
      <Row justify={"center"} style={{ paddingTop: 0 }}>
        <Space size={"large"} wrap style={{ display: "flex", justifyContent: "center" }}>
          <Card
            title={`${map} - ${type} game time`}
            style={{ marginTop: 40 }}
            bodyStyle={isMobile ? { width: "90vw", height: 300 } : { width: 480, height: 450 }}
          >
            <PlayTimeHistogram data={data[map]} />
          </Card>
          <Card
            title={`Percentage of ${type} games with particular game time`}
            style={{ marginTop: 40 }}
            bodyStyle={isMobile ? { width: "90vw", height: 300 } : { width: 645, height: 450 }}
          >
            <MapsPlayTimeHistogramStacked data={data} />
          </Card>
        </Space>
      </Row>
    </>
  );
};

export default MapStatsDetails;

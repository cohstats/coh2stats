import React, { ReactFragment, useEffect } from "react";
import { getMatchPlayersByFaction } from "../../utils/table-functions";
import { Card, Image, Space, Empty } from "antd";
import { getGeneralIconPath } from "../../coh/helpers";
import { SimplePieChart } from "../../components/charts-match/simple-pie";
import { MatchPlayerDetailsTable } from "./match-details-table";
import firebaseAnalytics from "../../analytics";
import { ProcessedMatch } from "../../coh/types";
import { getMapIconPath } from "../../coh/maps";

const generateSummaryChartData = (
  axisPlayers: Array<Record<string, any>>,
  alliesPlayers: Array<Record<string, any>>,
  value: string,
) => {
  const summaryAxis = axisPlayers.reduce((accumulator, currentValue) => {
    return accumulator + JSON.parse(currentValue.counters)[value];
  }, 0);

  const summaryAllies = alliesPlayers.reduce((accumulator, currentValue) => {
    return accumulator + JSON.parse(currentValue.counters)[value];
  }, 0);

  return [
    {
      id: "Allies",
      label: "Allies",
      value: summaryAllies,
    },
    {
      id: "Axis",
      label: "Axis",
      value: summaryAxis,
    },
  ];
};

interface ChartCardProps {
  data: Array<{
    id: string;
    label: string;
    value: number;
  }>;
  title: string | ReactFragment;
}

const ChartCard: React.FC<ChartCardProps> = ({ data, title }) => {
  let emptyChart = false;
  if (data) {
    emptyChart = data.every((item) => item.value === 0);
  }
  return (
    <Card
      title={<div style={{ textAlign: "center" }}>{title}</div>}
      size={"small"}
      bordered={false}
      bodyStyle={{ width: 200, height: 200, padding: 0 }}
    >
      {emptyChart ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <SimplePieChart data={data} displayLegend={true} />
      )}
    </Card>
  );
};

const MapCard: React.FC<{ data: ProcessedMatch }> = ({ data }) => {
  return (
    <Card
      title={<div style={{ textAlign: "center" }}>Map - {data.mapname}</div>}
      size={"small"}
      bordered={false}
      bodyStyle={{ width: 200, height: 200, padding: 7 }}
    >
      <Image
        src={getMapIconPath(data.mapname)}
        alt={data.mapname}
        style={{ borderRadius: 4 }}
        fallback="data:image/png;base64,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"
      />
    </Card>
  );
};

interface MatchDetailsProps {
  data: ProcessedMatch;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ data }) => {
  const axisPlayers = getMatchPlayersByFaction(data.matchhistoryreportresults, "axis");
  const alliesPlayers = getMatchPlayersByFaction(data.matchhistoryreportresults, "allies");

  useEffect(() => {
    firebaseAnalytics.playerCardFullMatchDetailsDisplayed();
  }, []);

  return (
    <>
      <div style={{ paddingTop: 20 }} />
      <MatchPlayerDetailsTable data={axisPlayers} matchhistoryitems={data.matchhistoryitems} />
      <div style={{ paddingTop: 20 }} />
      <MatchPlayerDetailsTable data={alliesPlayers} matchhistoryitems={data.matchhistoryitems} />
      <div style={{ height: 285 }}>
        <div style={{ float: "left" }}>
          <Space direction={"horizontal"}>
            <MapCard data={data} />
            <ChartCard
              data={generateSummaryChartData(axisPlayers, alliesPlayers, "dmgdone")}
              title={"Damage Dealt"}
            />
            <ChartCard
              data={generateSummaryChartData(axisPlayers, alliesPlayers, "ekills")}
              title={"Units Killed"}
            />
            <ChartCard
              data={generateSummaryChartData(axisPlayers, alliesPlayers, "vkill")}
              title={"Vehicle Killed"}
            />
          </Space>
        </div>
        <div style={{ float: "right" }}>
          <Space direction={"horizontal"}>
            <ChartCard
              data={generateSummaryChartData(axisPlayers, alliesPlayers, "fuelearn")}
              title={
                <>
                  <img src={getGeneralIconPath("fuel")} height="20px" alt={"Fuel"} /> Fuel Earned
                </>
              }
            />
            <ChartCard
              data={generateSummaryChartData(axisPlayers, alliesPlayers, "munearn")}
              title={
                <>
                  <img src={getGeneralIconPath("mun")} height="20px" alt={"Munition"} /> Munitions
                  Earned
                </>
              }
            />
          </Space>
        </div>
      </div>
    </>
  );
};

export default MatchDetails;

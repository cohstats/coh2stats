import React, { ReactFragment, useEffect } from "react";
import { getMatchPlayersByFaction } from "./table-functions";
import { Card, Space } from "antd";
import { getGeneralIconPath } from "../../coh/helpers";
import { SimplePieChart } from "../../components/charts-match/simple-pie";
import { MatchPlayerDetailsTable } from "./match-details-table";
import firebaseAnalytics from "../../analytics";

const generateSummaryChartData = (
  axisPlayers: Array<Record<string, any>>,
  alliesPlayers: Array<Record<string, any>>,
  value: string,
) => {
  const summaryAxis = axisPlayers.reduce((accumulator, currentValue) => {
    return JSON.parse(currentValue.counters)[value];
  }, 0);

  const summaryAllies = alliesPlayers.reduce((accumulator, currentValue) => {
    return JSON.parse(currentValue.counters)[value];
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
  return (
    <Card
      title={<div style={{ textAlign: "center" }}>{title}</div>}
      size={"small"}
      bordered={false}
      bodyStyle={{ width: 250, height: 250, padding: 0 }}
    >
      <SimplePieChart data={data} displayLegend={true} />
    </Card>
  );
};

interface MatchDetailsProps {
  data: Record<string, any>;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ data }) => {
  const axisPlayers = getMatchPlayersByFaction(data.matchhistoryreportresults, "axis");
  const alliesPlayers = getMatchPlayersByFaction(data.matchhistoryreportresults, "allies");

  useEffect(() => {
    firebaseAnalytics.playerCardFullMatchDetailsDisplayed();
  }, []);

  return (
    <>
      <MatchPlayerDetailsTable data={axisPlayers} />
      <div style={{ paddingTop: 20 }} />
      <MatchPlayerDetailsTable data={alliesPlayers} />
      <div style={{ height: 285 }}>
        <div style={{ float: "left" }}>
          <Space direction={"horizontal"}>
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

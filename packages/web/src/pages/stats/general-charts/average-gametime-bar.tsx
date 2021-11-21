import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { StatsDataObject, statsTypesInDB } from "../../../coh/types";
import { Empty } from "antd";

interface IProps {
  data: StatsDataObject;
}

export const AverageGameTimeBarChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  if (!data || !Object.prototype.hasOwnProperty.call(data["1v1"], "gameTime")) {
    return <Empty />;
  }

  for (let type of statsTypesInDB) {
    chartData.push({
      type: type,
      gameTime: (data[type].gameTime / data[type].matchCount / 60).toFixed(1),
    });
  }

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 20, bottom: 40, left: 70 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"vertical"}
      keys={["gameTime"]}
      indexBy="type"
      // label={(d) => `${((d.value|| 0)/60).toFixed(1)}`}
      colors={{ scheme: "nivo" }}
      colorBy={"id"}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        legend: "Minutes",
      }}
    />
  );
};

import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { Empty } from "antd";

interface IProps {
  data: Record<string, any>;
}

export const MapsPlayTimeHistogram: React.FC<IProps> = ({ data }) => {
  const chartData: any[] | undefined = [];

  if (!data || !Object.prototype.hasOwnProperty.call(data, "gameTimeSpread")) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No data`} />;
  }

  for (const [key, value] of Object.entries(data["gameTimeSpread"])) {
    if (key === "0") {
      chartData.push({
        time: "0 - 5",
        games: value,
      });
    } else if (key === "5") {
      chartData.push({
        time: "5 - 10",
        games: value,
      });
    } else if (key === "60") {
      chartData.push({
        time: "60+",
        games: value,
      });
    } else {
      chartData.push({
        time: `${key} - ${parseInt(key) + 10}`,
        games: value,
      });
    }
  }

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 25, bottom: 40, left: 50 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"vertical"}
      keys={["games"]}
      indexBy="time"
      // colors={{ scheme: 'blues' }}
      // colorBy={"indexValue"}
      minValue={0}
      maxValue={"auto"}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        legend: "Amout of games",
      }}
      axisBottom={{
        legend: "Minutes",
        legendPosition: "middle",
        legendOffset: 30,
      }}
    />
  );
};

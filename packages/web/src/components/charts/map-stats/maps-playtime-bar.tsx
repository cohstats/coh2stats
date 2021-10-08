import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { Empty } from "antd";

interface IProps {
  data: Record<string, any>;
  average: Boolean;
}

export const MapsPlayTime: React.FC<IProps> = ({ data, average = true }) => {
  const chartData: any[] | undefined = [];

  let nodata = false;

  for (const [key, value] of Object.entries(data)) {
    const averageTime = average
      ? (value.gameTime / value.matchCount / 60).toFixed(2)
      : value.gameTime;
    if (isNaN(averageTime)) {
      nodata = true;
      break;
    }

    chartData.push({
      mapName: key,
      value: averageTime,
      matchCount: value.matchCount,
    });
  }

  chartData.sort((a, b) => {
    if (a.matchCount < b.matchCount) {
      return -1;
    }
    if (a.matchCount > b.matchCount) {
      return 1;
    }
    return 0;
  });

  if (nodata) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No data`} />;
  }

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 30, bottom: 40, left: 170 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="mapName"
      colors={{ scheme: "nivo" }}
      colorBy={"indexValue"}
      minValue={0}
      maxValue={"auto"}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        legend: "Minutes",
        legendPosition: "middle",
        legendOffset: 30,
      }}
    />
  );
};

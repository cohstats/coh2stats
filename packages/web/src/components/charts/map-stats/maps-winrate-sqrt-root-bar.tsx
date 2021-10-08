import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { calculateRMS } from "../../../utils/helpers";

interface IProps {
  data: Record<string, any>;
}

const calculateWinrateSingleFaction = ({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}): number => {
  const result = ((0.5 - wins / (wins + losses)) * -100).toFixed(2);

  return parseFloat(!isNaN(parseFloat(result)) ? result : "0");
};

export const MapsWinRateSqrtChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  for (const [key, value] of Object.entries(data)) {
    chartData.push({
      mapName: key,
      value: calculateRMS(
        calculateWinrateSingleFaction(value["wermacht"]),
        calculateWinrateSingleFaction(value["wgerman"]),
        calculateWinrateSingleFaction(value["british"]),
        calculateWinrateSingleFaction(value["soviet"]),
        calculateWinrateSingleFaction(value["usf"]),
      ).toFixed(2),
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

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 30, bottom: 40, left: 160 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="mapName"
      colors={{ scheme: "nivo" }}
      colorBy={"indexValue"}
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
        legend: "Deviation from 50%",
        legendPosition: "middle",
        legendOffset: 30,
      }}
    />
  );
};

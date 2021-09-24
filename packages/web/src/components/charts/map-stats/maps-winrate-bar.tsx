import { ResponsiveBar } from "@nivo/bar";
import React from "react";

interface IProps {
  data: Record<string, any>;
}

/**
 * Returns 0.5 - axis winrate // which means positive numbers are
 * @param singleMapData
 */
const calculateSingleMapWinRateDiff = (
  singleMapData: Record<string, { wins: number; losses: number }>,
) => {
  const axisWins = singleMapData.wermacht.wins + singleMapData.wgerman.wins;
  const axisLoss = singleMapData.wermacht.losses + singleMapData.wgerman.losses;

  const alliesWins =
    singleMapData.british.wins + singleMapData.usf.wins + singleMapData.soviet.wins;
  const alliesLoss =
    singleMapData.british.losses + singleMapData.usf.losses + singleMapData.soviet.losses;

  if (axisWins !== alliesLoss) {
    console.warn(`We have more wins than losses! Data issue ${axisWins} != ${alliesLoss}`);
  }
  if (axisLoss !== alliesWins) {
    console.warn(`We have more wins than losses! Data issue ${axisLoss} != ${alliesWins}`);
  }

  return ((0.5 - axisWins / (axisWins + axisLoss)) * -100).toFixed(2);
};

export const MapsWinRateChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  for (const [key, value] of Object.entries(data)) {
    chartData.push({
      mapName: key,
      value: calculateSingleMapWinRateDiff(value),
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
      minValue={-30}
      maxValue={30}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        legend: "Allies ... ... % ... ...  Axis",
        legendPosition: "middle",
        legendOffset: 30,
      }}
    />
  );
};

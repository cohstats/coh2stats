import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { StatsDataObject, statsTypesInDB, validRaceNames } from "../../../coh/types";
import { formatFactionName } from "../../../utils/helpers";

const calculateWinRate = (data: { wins: number; losses: number }) => {
  return (data.wins / (data.wins + data.losses)) * 100;
};

interface IProps {
  data: StatsDataObject;
}

export const TotalFactionWinRateChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  const result: Record<string, any> = {};

  for (let type of statsTypesInDB) {
    for (let faction of validRaceNames) {
      const currrentWinrate = calculateWinRate(data[type][faction]);
      result[faction] = (result[faction] + currrentWinrate) / 2 || currrentWinrate;
    }
  }

  for (let faction of validRaceNames) {
    chartData.push({
      faction: formatFactionName(faction),
      winRate: result[faction].toFixed(2),
    });
  }

  chartData.reverse();

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 20, bottom: 40, left: 70 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"horizontal"}
      keys={["winRate"]}
      indexBy="faction"
      label={(d) => `${(d.value || 0).toFixed(2)}%`}
      colors={{ scheme: "nivo" }}
      colorBy={"id"}
      minValue={0}
      maxValue={100}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
    />
  );
};

import { Bar } from "@nivo/bar";
import React from "react";

const calculateWinRate = (data: { wins: number; losses: number }) => {
  return {
    winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
  };
};

export const WinRateChart = (data: Record<string, any>) => {
  let chartData = [
    { ...{ faction: "WGerman", ...calculateWinRate(data["wgerman"]) } },
    { ...{ faction: "Wermacht", ...calculateWinRate(data["wermacht"]) } },
    { ...{ faction: "USF", ...calculateWinRate(data["usf"]) } },
    { ...{ faction: "Soviet", ...calculateWinRate(data["soviet"]) } },
    { ...{ faction: "British", ...calculateWinRate(data["british"]) } },
  ];

  return (
    <Bar
      height={400}
      width={450}
      margin={{ top: 0, right: 30, bottom: 40, left: 70 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"horizontal"}
      keys={["winRate"]}
      indexBy="faction"
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

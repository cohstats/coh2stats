import { Bar } from "@nivo/bar";
import React from "react";

const calculateWinRate = (data: { wins: number; losses: number }) => {
  return {
    winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
  };
};

export const WinRateChart = (data: Record<string, any>) => {
  const chartData = [
    { ...{ faction: "British", ...calculateWinRate(data["british"]) } },
    { ...{ faction: "Soviet", ...calculateWinRate(data["soviet"]) } },
    { ...{ faction: "USF", ...calculateWinRate(data["usf"]) } },
    { ...{ faction: "Wermacht", ...calculateWinRate(data["wermacht"]) } },
    { ...{ faction: "WGerman", ...calculateWinRate(data["wgerman"]) } },
  ];

  return (
    <Bar
      height={500}
      width={550}
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

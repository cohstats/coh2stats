import { ResponsiveBar } from "@nivo/bar";
import React, { useMemo } from "react";

const calculateWinRate = (data: { wins: number; losses: number }) => {
  return {
    winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
  };
};

interface IProps {
  data: Record<string, any>;
}

export const WinRateChart: React.FC<IProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return [
      { ...{ faction: "WGerman", ...calculateWinRate(data["wgerman"]) } },
      { ...{ faction: "Wermacht", ...calculateWinRate(data["wermacht"]) } },
      { ...{ faction: "USF", ...calculateWinRate(data["usf"]) } },
      { ...{ faction: "Soviet", ...calculateWinRate(data["soviet"]) } },
      { ...{ faction: "British", ...calculateWinRate(data["british"]) } },
    ];
  }, [data]);

  return (
    <ResponsiveBar
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

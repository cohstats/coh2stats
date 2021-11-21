import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { StatsDataObject, statsTypesInDB, validRaceNames } from "../../../coh/types";

const calculateWinRate = (data: { wins: number; losses: number }) => {
  return (data.wins / (data.wins + data.losses)) * 100;
};

interface IProps {
  data: StatsDataObject;
}

export const FactionWinRateStackedChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  for (let faction of validRaceNames) {
    const result: Record<string, number | string> = {
      faction: faction,
    };

    // "1v1" ,"2v2
    for (let type of statsTypesInDB) {
      result[type] = calculateWinRate(data[type][faction]).toFixed(2);
    }

    chartData.push(result);
  }

  return (
    <ResponsiveBar
      margin={{ top: 10, right: 80, bottom: 40, left: 40 }}
      data={chartData}
      layout={"vertical"}
      keys={statsTypesInDB}
      indexBy="faction"
      colors={{ scheme: "nivo" }}
      label={(d) => `${(d.value || 0).toFixed(1)}%`}
      colorBy={"id"}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

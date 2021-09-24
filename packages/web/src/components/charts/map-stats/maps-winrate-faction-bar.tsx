import { ResponsiveBar } from "@nivo/bar";
import React from "react";

interface IProps {
  data: Record<string, any>;
}

const calculateWinrateSingleFaction = ({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}): string => {
  const result = ((0.5 - wins / (wins + losses)) * -100).toFixed(2);

  return !isNaN(parseFloat(result)) ? result : "0";
};

export const MapsFactionWinRateChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  for (const [key, value] of Object.entries(data)) {
    chartData.push({
      mapName: key,
      wehrmacht: calculateWinrateSingleFaction(value["wermacht"]),
      wgerman: calculateWinrateSingleFaction(value["wgerman"]),
      british: calculateWinrateSingleFaction(value["british"]),
      soviet: calculateWinrateSingleFaction(value["soviet"]),
      usf: calculateWinrateSingleFaction(value["usf"]),
      matchCount: value.matchCount,
    });
  }

  chartData.sort((a, b) => {
    if (a.matchCount < b.matchCount) {
      return 1;
    }
    if (a.matchCount > b.matchCount) {
      return -1;
    }
    return 0;
  });

  return (
    <ResponsiveBar
      margin={{ top: 5, right: 120, bottom: 95, left: 25 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"vertical"}
      groupMode={"grouped"}
      keys={["wehrmacht", "wgerman", "british", "soviet", "usf"]}
      indexBy="mapName"
      colors={{ scheme: "nivo" }}
      minValue={-25}
      maxValue={25}
      enableGridX={true}
      gridXValues={50}
      innerPadding={2}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        legendOffset: 30,
        tickRotation: -45,
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

import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { Empty } from "antd";

interface IProps {
  data: Record<string, any>;
}

export const MapsPlayTimeHistogramStacked: React.FC<IProps> = ({ data }) => {
  const chartData: any[] | undefined = [];

  if (
    !data ||
    Object.keys(data).length === 0 ||
    !Object.prototype.hasOwnProperty.call(Object.values(data)[0], "gameTimeSpread")
  ) {
    return <Empty />;
  }

  for (const [key, mapObject] of Object.entries(data)) {
    let gameTimeSpreadAsPercentage = Object.fromEntries(
      Object.entries(mapObject["gameTimeSpread"]).map(([k, v]) => {
        // @ts-ignore
        const percentageValue = ((v / mapObject["matchCount"]) * 100).toFixed(2);
        let finalKey = "";

        if (k === "0") {
          finalKey = "0 - 5";
        } else if (k === "5") {
          finalKey = "5 - 10";
        } else if (k === "60") {
          finalKey = "60+";
        } else {
          finalKey = `${k} - ${parseInt(k) + 10}`;
        }
        return [finalKey, percentageValue];
      }),
    );

    chartData.push({
      ...{
        mapName: key,
        matchCount: mapObject["matchCount"],
      },
      ...gameTimeSpreadAsPercentage,
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
      margin={{ top: 0, right: 85, bottom: 40, left: 120 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"horizontal"}
      keys={["0 - 5", "5 - 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50 - 60", "60+"]}
      indexBy="mapName"
      label={(d) => `${Math.round(d.value || 0)}`}
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
      }}
      axisBottom={{
        legend: "% of games",
        legendPosition: "middle",
        legendOffset: 30,
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

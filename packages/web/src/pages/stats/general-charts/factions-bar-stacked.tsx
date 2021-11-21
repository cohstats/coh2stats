import { ResponsiveBar } from "@nivo/bar";
import React from "react";

import { StatsDataObject, statsTypesInDB, validRaceNames } from "../../../coh/types";

interface IProps {
  data: StatsDataObject;
}

export const FactionsBarStackedChart: React.FC<IProps> = ({ data }) => {
  const chartData = [];

  // "1v1" ,"2v2
  let amountOfPlayers = 2;
  for (let type of statsTypesInDB) {
    const result: Record<string, number | string> = {
      type: type,
    };
    for (let faction of validRaceNames) {
      result[faction] = (
        ((data[type][faction].wins + data[type][faction].losses) /
          data[type].matchCount /
          amountOfPlayers) *
        100
      ).toFixed(2);
    }

    amountOfPlayers += 2;
    chartData.push(result);
  }

  return (
    <ResponsiveBar
      margin={{ top: 10, right: 80, bottom: 40, left: 40 }}
      data={chartData}
      layout={"vertical"}
      keys={validRaceNames}
      indexBy="type"
      colors={{ scheme: "nivo" }}
      label={(d) => `${Math.round(d.value || 0)}%`}
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

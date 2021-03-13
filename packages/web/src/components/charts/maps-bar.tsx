import { Bar } from "@nivo/bar";
import React from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";

export const MapBarChart = (maps: Record<string, number>) => {
  // TODO: REWORK THIS SHIT
  // @ts-ignore
  let mapsData: Array<Record<string, string>> = Object.keys(maps).map((mapName) => {
    return {
      mapName: mapName,
      value: maps[mapName],
    };
  });

  mapsData = sortArrayOfObjectsByTheirPropertyValue(mapsData);

  return (
    <Bar
      height={600}
      width={1100}
      margin={{ top: 0, right: 0, bottom: 40, left: 200 }}
      // @ts-ignore
      data={mapsData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="mapName"
      colors={{ scheme: "nivo" }}
      colorBy={"index"}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        legend: "Number of games",
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 32,
      }}
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

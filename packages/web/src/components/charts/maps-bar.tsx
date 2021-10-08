import { ResponsiveBar } from "@nivo/bar";
import React, { memo, useMemo } from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";

interface IProps {
  maps: Record<string, number>;
}

export const _MapBarChart: React.FC<IProps> = ({ maps }) => {
  const mapsData = useMemo(() => {
    const mapsDataUnsorted: { mapName: string; value: number }[] = Object.keys(maps).map(
      (mapName) => {
        return {
          mapName: mapName,
          value: maps[mapName],
        };
      },
    );
    return sortArrayOfObjectsByTheirPropertyValue(
      mapsDataUnsorted as unknown as Array<Record<string, string>>,
    );
  }, [maps]);

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 0, bottom: 40, left: 185 }}
      // @ts-ignore
      data={mapsData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="mapName"
      colors={{ scheme: "nivo" }}
      colorBy={"indexValue"}
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

export const MapBarChart = memo(_MapBarChart);

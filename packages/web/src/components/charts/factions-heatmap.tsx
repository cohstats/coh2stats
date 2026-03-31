"use client";

import { ResponsiveHeatMap } from "@nivo/heatmap";
import React, { memo } from "react";

interface IProps {
  data: Array<Record<string, any>>;
  keys: Array<string>;
}

export const _HeatMapChart: React.FC<IProps> = ({ data, keys }) => {
  return (
    // probably Nivo bug
    <ResponsiveHeatMap
      // @ts-expect-error - Nivo types are not compatible with our data structure
      data={data}
      keys={keys}
      indexBy="leftAxis"
      margin={{ top: 40, right: 0, bottom: 60, left: 70 }}
      forceSquare={true}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        legend: "Allies factions",
        legendPosition: "middle",
        legendOffset: -35,
      }}
      axisRight={null}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Axis factions",
        legendPosition: "middle",
        legendOffset: -60,
      }}
      cellOpacity={1}
      cellBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
      minValue={0}
      maxValue={1}
      defs={[
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(0, 0, 0, 0.1)",
          rotation: -45,
          lineWidth: 4,
          spacing: 7,
        },
      ]}
      fill={[{ id: "lines" }]}
      animate={true}
      motionConfig="wobbly"
      hoverTarget="cell"
      cellHoverOthersOpacity={0.5}
    />
  );
};

export const HeatMapChart = memo(_HeatMapChart);

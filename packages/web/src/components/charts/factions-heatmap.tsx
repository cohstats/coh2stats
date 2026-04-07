"use client";

import { ResponsiveHeatMap } from "@nivo/heatmap";
import React, { memo } from "react";

interface IProps {
  data: Array<{ id: string; data: Array<{ x: string; y: number }> }>;
  keys: Array<string>;
}

export const _HeatMapChart: React.FC<IProps> = ({ data, keys }) => {
  // Data is already transformed to Nivo format in factions.tsx
  // Determine colors based on data - assuming winRate type data (0-1 range)
  const colorsDefinition = {
    type: "diverging" as const,
    scheme: "red_yellow_green" as const,
    minValue: 0.35,
    maxValue: 0.65,
    divergeAt: 0.5,
  };

  return (
    <ResponsiveHeatMap
      data={data}
      colors={colorsDefinition}
      margin={{ top: 20, right: 0, bottom: 0, left: 70 }}
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
      borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
      label={(cell) => (cell.value !== null ? `${(cell.value * 100).toFixed(1)}%` : "N/A")}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
      valueFormat=">-.2%"
      animate={false}
      hoverTarget="cell"
    />
  );
};

export const HeatMapChart = memo(_HeatMapChart);

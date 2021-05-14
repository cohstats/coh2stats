import { HeatMap } from "@nivo/heatmap";
import React from "react";

interface IProps {
  data: Array<Record<string, any>>;
  keys: Array<string>;
  width: number;
  height: number;
}

export const HeatMapChart: React.FC<IProps> = ({ data, keys, width, height }) => {
  return (
    // probably Nivo bug
    // @ts-ignore
    <HeatMap
      width={width}
      height={height}
      data={data}
      keys={keys}
      indexBy="leftAxis"
      margin={{ top: 40, right: 0, bottom: 60, left: 70 }}
      forceSquare={true}
      axisTop={{
        orient: "top",
        tickSize: 5,
        tickPadding: 5,
        legend: "Allies factions",
        legendPosition: "middle",
        legendOffset: -35,
      }}
      axisRight={null}
      axisBottom={null}
      axisLeft={{
        orient: "left",
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
      motionStiffness={80}
      motionDamping={9}
      hoverTarget="cell"
      cellHoverOthersOpacity={0.25}
    />
  );
};

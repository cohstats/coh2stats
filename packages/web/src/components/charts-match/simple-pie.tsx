import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";
import {
  convertCommanderIDToName,
  getCommanderData,
  getCommanderIconPath,
} from "../../coh/commanders";
import { Avatar } from "antd";
import routes from "../../routes";
import type { History } from "history";

interface DamageDonePieChartProps {
  data: Array<{
    id: string;
    label: string;
    value: number;
  }>;
  displayLegend?: boolean;
}

export const SimplePieChart: React.FC<DamageDonePieChartProps> = ({
  data,
  displayLegend = false,
}) => {
  const legend = displayLegend
    ? [
        {
          anchor: "bottom-right",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 30,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]
    : [];

  const margin = displayLegend
    ? { top: 10, right: 10, bottom: 40, left: 10 }
    : { top: 10, right: 10, bottom: 10, left: 10 };

  return (
    <ResponsivePie
      data={data}
      margin={margin}
      innerRadius={0.4}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLabelsSkipAngle={10}
      enableArcLinkLabels={false}
      // @ts-ignore
      legends={legend}
    />
  );
};

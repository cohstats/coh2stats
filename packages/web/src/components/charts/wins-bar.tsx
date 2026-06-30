"use client";

import { ResponsiveBar } from "@nivo/bar";
import React, { useMemo } from "react";

interface IProps {
  data: Record<string, any>;
}

export const WinsChart: React.FC<IProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return [
      { faction: "British", ...data["british"] },
      { faction: "Soviet", ...data["soviet"] },
      { faction: "USF", ...data["usf"] },
      { faction: "Wermacht", ...data["wermacht"] },
      { faction: "WGerman", ...data["wgerman"] },
    ];
  }, [data]);

  return (
    <ResponsiveBar
      margin={{ top: 10, right: 10, bottom: 40, left: 45 }}
      // @ts-ignore
      data={chartData as data[] | undefined}
      layout={"vertical"}
      keys={["wins", "losses"]}
      indexBy="faction"
      colors={{ scheme: "nivo" }}
      colorBy={"id"}
      innerPadding={2}
      defs={[
        {
          id: "green",
          type: "linearGradient",
          colors: [{ offset: 100, color: "#60BD68" }],
        },
        {
          id: "red",
          type: "linearGradient",
          colors: [{ offset: 100, color: "#F15854" }],
        },
      ]}
      fill={[
        {
          match: {
            id: "wins",
          },
          id: "green",
        },
        {
          match: {
            id: "losses",
          },
          id: "red",
        },
      ]}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        tickRotation: -25
      }}
    />
  );
};

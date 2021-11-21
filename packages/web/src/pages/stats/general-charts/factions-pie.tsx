import { ResponsivePie } from "@nivo/pie";
import React from "react";
import {
  RaceName,
  StatsDataObject,
  statsTypesInDB,
  statTypesInDbAsType,
  validRaceNames,
} from "../../../coh/types";

interface FactionsPlayedPieChartProps {
  data: StatsDataObject;
}

export const FactionsPlayedPieChart: React.FC<FactionsPlayedPieChartProps> = ({ data }) => {
  const factionGames: Record<string, number> = {};

  // "1v1", "2v2", "3v3" ...
  for (let type of statsTypesInDB) {
    const typeObject = data[type as statTypesInDbAsType];

    for (let faction of validRaceNames) {
      let totalAmountOfGames =
        typeObject[faction as RaceName].wins + typeObject[faction as RaceName].losses;
      totalAmountOfGames = isNaN(totalAmountOfGames) ? 0 : totalAmountOfGames;
      factionGames[faction] = factionGames[faction] + totalAmountOfGames || totalAmountOfGames;
    }
  }

  //We want to have manual order and naming
  const chartData = [
    {
      id: "British",
      label: "British",
      value: factionGames["british"],
    },
    {
      id: "Soviet",
      label: "Soviet",
      value: factionGames["soviet"],
    },
    {
      id: "USF",
      label: "USF",
      value: factionGames["usf"],
    },
    {
      id: "Wermacht",
      label: "Wehrmacht",
      value: factionGames["wermacht"],
    },
    {
      id: "WGerman",
      label: "WGerman",
      value: factionGames["wgerman"],
    },
  ];

  return (
    <ResponsivePie
      // @ts-ignore
      data={chartData}
      margin={{ bottom: 5, top: 5, right: 38 }}
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
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 35,
          translateY: 5,
          itemsSpacing: 5,
          itemWidth: 72,
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
      ]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
      ]}
      fill={[
        {
          match: {
            id: "British",
          },
          id: "dots",
        },
        {
          match: {
            id: "Soviet",
          },
          id: "dots",
        },
        {
          match: {
            id: "USF",
          },
          id: "dots",
        },
      ]}
    />
  );
};

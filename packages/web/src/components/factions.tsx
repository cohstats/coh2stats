"use client";

import React, { memo } from "react";
import { Card, Empty, Radio, Tooltip } from "antd";
import { HeatMapChart } from "./charts/factions-heatmap";
import { Helper } from "./helper";
import { Typography } from "antd";
import Image from "next/image";
import {
  wermachtSmallIcon,
  wgermanSmallIcon,
  britishSmallIcon,
  sovietSmallIcon,
  usfSmallIcon,
} from "../coh/generalIconImports";
import firebaseAnalytics from "../analytics";
const { Text } = Typography;

interface IProps {
  data: Record<string, any>;
  style: Record<string, any>;
  title: string;
}

const extractFactionString = (factionString: string): Record<string, string> => {
  const match = factionString.match(/(.+)x(.+)/);

  return {
    axis: (match && match[1]) || "",
    allies: (match && match[2]) || "",
  };
};

const legend = (
  <div style={{ display: "inline-block", width: 125, verticalAlign: "top", paddingTop: 40 }}>
    <Tooltip title={"W - (Wehrmacht, Ostheer, German)"}>
      <div>
        <Image src={wermachtSmallIcon} width={18} height={18} alt="Wehrmacht" />{" "}
        <Text strong>W</Text> - Wehrmacht
      </div>
    </Tooltip>
    <Tooltip title={"O - (OKW, West German, Oberkommando West)"}>
      <div>
        <Image src={wgermanSmallIcon} width={18} height={18} alt="OKW" /> <Text strong>O</Text> -
        OKW
      </div>
    </Tooltip>
    <br />
    <Tooltip title={"B - (British, UKF)"}>
      <div>
        <Image src={britishSmallIcon} width={18} height={18} alt="British" />{" "}
        <Text strong>B</Text> - British
      </div>
    </Tooltip>
    <Tooltip title={"S - (Soviet)"}>
      <div>
        <Image src={sovietSmallIcon} width={18} height={18} alt="Soviet" /> <Text strong>S</Text>{" "}
        - Soviet
      </div>
    </Tooltip>
    <Tooltip title={"U - (USF, US Forces, USA)"}>
      <div>
        <Image src={usfSmallIcon} width={18} height={18} alt="USF" /> <Text strong>U</Text> - USF
      </div>
    </Tooltip>
  </div>
);

const _FactionVsFactionCard: React.FC<IProps> = ({ title, data, style }) => {
  const factionData: Record<string, Record<string, number>> = data
    ? data["factionMatrix"]
    : undefined;

  // We should use useMemo for these values, there is lot of iterations which are recalculated "unnecessary"
  const keysForHeatMapSet: Set<string> = new Set();
  const factionDataByKey: Record<string, Record<string, any>> = {};

  // const query = useQuery();
  // const statsSourceQuery = query.get("statsSource");

  const [factionWinRate, setFactionWinRate] = React.useState("axis");
  const [heatmapValues, setHeatmapValues] = React.useState("winRate");

  if (!factionData) {
    return (
      <Card title={title} style={{ ...{ width: 900, height: 250 }, ...style }}>
        <Empty />
      </Card>
    );
  }

  const changeHeatMapStyle = (value: string) => {
    firebaseAnalytics.teamCompositionUsed(factionWinRate, value);
    setHeatmapValues(value);
  };

  const changeFactionDisplay = (value: string) => {
    firebaseAnalytics.teamCompositionUsed(value, heatmapValues);
    setFactionWinRate(value);
  };

  // Prepare transformation
  for (const [key, value] of Object.entries(factionData)) {
    const { axis, allies } = extractFactionString(key);

    const leftAxisString = axis;
    const topAxisString = allies;

    keysForHeatMapSet.add(topAxisString);
    if (!Object.prototype.hasOwnProperty.call(factionDataByKey, leftAxisString)) {
      factionDataByKey[leftAxisString] = {};
    }
    factionDataByKey[leftAxisString][topAxisString] = (() => {
      if (heatmapValues !== "winRate") {
        return value["wins"] + value["losses"];
      } else {
        const winRate: number = value["wins"] / (value["wins"] + value["losses"]);
        if (factionWinRate === "axis") {
          return winRate.toFixed(2);
        } else {
          return (1 - winRate).toFixed(2);
        }
      }
    })();
  }

  // Add total summary for axis (on the right side of the heatmap)
  if (factionWinRate === "axis") {
    keysForHeatMapSet.add("sum");
    for (const [key, arrayOfValues] of Object.entries(factionDataByKey)) {
      let sumCounter = 0;
      const valuesOfArray = Object.values(arrayOfValues);
      for (const singleValue of valuesOfArray) {
        if (!isNaN(parseFloat(singleValue))) {
          sumCounter += parseFloat(singleValue);
        }
      }
      if (heatmapValues === "winRate") {
        sumCounter /= valuesOfArray.length;
        factionDataByKey[key]["sum"] = sumCounter.toFixed(2);
      } else {
        factionDataByKey[key]["sum"] = sumCounter;
      }
    }
  }

  // Transform for the heatmap - prepare intermediate data
  const dataForHeatmapIntermediate: Array<Record<string, any>> = [];

  for (const [key, value] of Object.entries(factionDataByKey)) {
    value["leftAxis"] = key;
    dataForHeatmapIntermediate.push(value);
  }

  dataForHeatmapIntermediate.sort((firstObject, secondObject) => {
    if (firstObject["leftAxis"] > secondObject["leftAxis"]) {
      return -1;
    }
    if (firstObject["leftAxis"] > secondObject["leftAxis"]) {
      return 1;
    }
    return 0;
  });

  // Sort keys, but ensure "sum" is always at the end
  const keysForHeatMap = [...keysForHeatMapSet].sort((a, b) => {
    // If 'a' is "sum", it should come after 'b'
    if (a === "sum") return 1;
    // If 'b' is "sum", 'a' should come before 'b'
    if (b === "sum") return -1;
    // Otherwise, sort alphabetically
    return a < b ? -1 : a > b ? 1 : 0;
  });

  // Allies are added after transformation cos it's easier (on the bottom side of the heatmap)
  if (factionWinRate === "allies") {
    const finalSumForAllies: Record<string, any> = {};

    for (const oneLine of dataForHeatmapIntermediate) {
      for (const [key, value] of Object.entries(oneLine)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          finalSumForAllies[key] = parseFloat(finalSumForAllies[key]) + numValue || numValue;
        }
      }
    }

    if (heatmapValues === "winRate") {
      for (const [key, value] of Object.entries(finalSumForAllies)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // -1 because we have leftAxis there
          finalSumForAllies[key] = (numValue / dataForHeatmapIntermediate.length).toFixed(2);
        }
      }
    }

    finalSumForAllies["leftAxis"] = "sum";
    dataForHeatmapIntermediate.push(finalSumForAllies);
  }

  // Transform to Nivo heatmap format
  const dataForHeatmap = dataForHeatmapIntermediate.map((row) => {
    const { leftAxis, ...rest } = row;
    return {
      id: leftAxis,
      // Use keysForHeatMap order to ensure proper sorting
      data: keysForHeatMap.map((key) => ({
        x: key,
        y: rest[key] !== undefined ? rest[key] : 0,
      })),
    };
  });

  const menu = (
    <>
      <Radio.Group onChange={(e) => changeHeatMapStyle(e.target.value)} value={heatmapValues}>
        <Radio value={"winRate"}>
          Winrate{" "}
          <Helper
            text={
              "Check that winrate for the particular combination has enough games to provide valid results."
            }
          />
        </Radio>

        <Radio value={"amountOfGames"}>Amount of games</Radio>
      </Radio.Group>
      <Radio.Group onChange={(e) => changeFactionDisplay(e.target.value)} value={factionWinRate}>
        <Radio value={"axis"}>Axis</Radio>
        <Radio value={"allies"}>Allies</Radio>
      </Radio.Group>
    </>
  );

  return (
    <Card
      title={
        <>
          <span>{title}</span>{" "}
          <Helper
            text={
              "We are not able to distinguish between Arranged Teams and Random team matches. Games from both " +
              "types are included here."
            }
          />
        </>
      }
      style={{ ...{ width: 995, height: 470 }, ...style }}
      extra={menu}
    >
      {!factionData ? (
        <Empty />
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {legend}
          <div style={{ width: 820, height: 380 }}>
            <HeatMapChart
              data={dataForHeatmap}
              keys={keysForHeatMap}
              heatmapValues={heatmapValues}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export const FactionVsFactionCard = memo(_FactionVsFactionCard);

import React, { useMemo } from "react";
import { Card, Empty, Radio } from "antd";
import { HeatMapChart } from "../../components/charts/factions-heatmap";
import { Helper } from "../../components/helper";

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

export const FactionVsFactionCard: React.FC<IProps> = ({ title, data, style }) => {
  const factionData: Record<string, Record<string, number>> = data["factionMatrix"];

  const keysForHeatMapSet: Set<string> = new Set();
  const factionDataByKey: Record<string, Record<string, any>> = {};

  const [factionWinRate, setFactionWinRate] = React.useState("axis");
  const [heatmapValues, setHeatmapValues] = React.useState("winRate");

  if (!factionData) {
    return (
      <Card title={title} style={{ ...style, ...{ width: 900, height: 250 } }}>
        <Empty />
      </Card>
    );
  }

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
        let winRate: number = value["wins"] / (value["wins"] + value["losses"]);
        if (factionWinRate === "axis") {
          return winRate.toPrecision(2);
        } else {
          return (1 - winRate).toPrecision(2);
        }
      }
    })();
  }

  // Transform for the heatmap
  const dataForHeatmap: Array<Record<string, any>> = [];

  for (const [key, value] of Object.entries(factionDataByKey)) {
    value["leftAxis"] = key;
    dataForHeatmap.push(value);
  }

  dataForHeatmap.sort((firstObject, secondObject) => {
    if (firstObject["leftAxis"] > secondObject["leftAxis"]) {
      return -1;
    }
    if (firstObject["leftAxis"] > secondObject["leftAxis"]) {
      return 1;
    }
    return 0;
  });
  const keysForHeatMap = [...keysForHeatMapSet].sort();

  const menu = (
    <>
      <Radio.Group onChange={(e) => setHeatmapValues(e.target.value)} value={heatmapValues}>
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
      <Radio.Group onChange={(e) => setFactionWinRate(e.target.value)} value={factionWinRate}>
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
      style={{ ...style, ...{ width: 900, height: 440 } }}
      extra={menu}
    >
      {!factionData ? (
        <Empty />
      ) : (
        <HeatMapChart data={dataForHeatmap} keys={keysForHeatMap} width={820} height={400} />
      )}
    </Card>
  );
};

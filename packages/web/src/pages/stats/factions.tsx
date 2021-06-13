import React from "react";
import { Card, Empty, Radio, Tooltip } from "antd";
import { HeatMapChart } from "../../components/charts/factions-heatmap";
import { Helper } from "../../components/helper";
import { Typography } from "antd";
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
        <img
          width={18}
          height={18}
          src={"/resources/generalIcons/wermacht_small.png"}
          alt="wermacht"
        />{" "}
        <Text strong>W</Text> - Wehrmacht
      </div>
    </Tooltip>
    <Tooltip title={"O - (OKW, West German, Oberkommando West)"}>
      <div>
        <img width={18} height={18} src={"/resources/generalIcons/wgerman_small.png"} alt="OKW" />{" "}
        <Text strong>O</Text> - OKW
      </div>
    </Tooltip>
    <br />
    <Tooltip title={"B - (British, UKF)"}>
      <div>
        <img
          width={18}
          height={18}
          src={"/resources/generalIcons/british_small.png"}
          alt="British"
        />{" "}
        <Text strong>B</Text> - British
      </div>
    </Tooltip>
    <Tooltip title={"S - (Soviet)"}>
      <div>
        <img
          width={18}
          height={18}
          src={"/resources/generalIcons/soviet_small.png"}
          alt="Soviet"
        />{" "}
        <Text strong>S</Text> - Soviet
      </div>
    </Tooltip>
    <Tooltip title={"U - (USF, US Forces, USA)"}>
      <div>
        <img width={18} height={18} src={"/resources/generalIcons/usf_small.png"} alt="USF" />{" "}
        <Text strong>U</Text> - USF
      </div>
    </Tooltip>
  </div>
);

export const FactionVsFactionCard: React.FC<IProps> = ({ title, data, style }) => {
  const factionData: Record<string, Record<string, number>> = data["factionMatrix"];

  // We should use useMemo for these values, there is lot of iterations which are recalculated "unnecessary"
  const keysForHeatMapSet: Set<string> = new Set();
  const factionDataByKey: Record<string, Record<string, any>> = {};

  // const query = useQuery();
  // const statsSourceQuery = query.get("statsSource");

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

  // Allies are added after transformation cos it's easier (on the bottom side of the heatmap)
  if (factionWinRate === "allies") {
    const finalSumForAllies: Record<string, any> = {};

    for (const oneLine of dataForHeatmap) {
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
          finalSumForAllies[key] = (numValue / dataForHeatmap.length).toFixed(2);
        }
      }
    }

    finalSumForAllies["leftAxis"] = "sum";
    dataForHeatmap.push(finalSumForAllies);
  }

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
      style={{ ...style, ...{ width: 995, height: 440 } }}
      extra={menu}
    >
      {!factionData ? (
        <Empty />
      ) : (
        <div>
          {legend}
          <div style={{ display: "inline-block" }}>
            <HeatMapChart data={dataForHeatmap} keys={keysForHeatMap} width={820} height={400} />
          </div>
        </div>
      )}
    </Card>
  );
};

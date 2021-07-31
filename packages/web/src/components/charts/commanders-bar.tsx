import { ResponsiveBar } from "@nivo/bar";
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

interface CommandersBarChartProps {
  commanders: Record<number, number>;
  push: {
    (path: string, state?: unknown): void;
    (location: History.LocationDescriptor<unknown>): void;
  };
}

export const CommandersBarChart: React.FC<CommandersBarChartProps> = ({ commanders, push }) => {
  const simpleMapsData = [];

  for (const [key, value] of Object.entries(commanders)) {
    simpleMapsData.push({
      commanderName: convertCommanderIDToName(key),
      commanderId: key,
      value: value,
    });
  }

  const mapsData = sortArrayOfObjectsByTheirPropertyValue(
    simpleMapsData as unknown as Array<Record<string, string>>,
  );

  const toolTipFunction = (toolTipData: Record<string, any>) => {
    const commanderData = getCommanderData(toolTipData.data.commanderId);
    if (!commanderData) return <div />;

    const iconPath = getCommanderIconPath(commanderData?.iconSmall);

    return (
      <div>
        <Avatar
          size={54}
          shape="square"
          src={iconPath}
          style={{ display: "inline-block", verticalAlign: "top" }}
        />
        <div style={{ display: "inline-block", paddingLeft: 5, maxWidth: 500 }}>
          <b>
            {commanderData.commanderName} - {toolTipData.value}{" "}
          </b>
          <br />
          <i>Click for more info ...</i>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveBar
      margin={{ top: 0, right: 20, bottom: 40, left: 180 }}
      // @ts-ignore
      data={mapsData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="commanderName"
      colors={{ scheme: "nivo" }}
      colorBy={"index"}
      animate={false}
      tooltip={toolTipFunction}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        legend: "No. equipped when match started",
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
      onClick={(event) => {
        const commanderId: string = event.data["commanderId"] as string;
        const commanderData = getCommanderData(commanderId);
        push(routes.commanderByID(commanderData?.races[0], commanderId));
      }}
    />
  );
};

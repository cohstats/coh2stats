import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";
import {
  convertCommanderIDToName,
  getCommanderData,
  getCommanderIconPath,
} from "../../coh/commanders";
import { Avatar, Card } from "antd";
import routes from "../../routes";
import { CommanderAbilitiesComponent } from "../../pages/commanders/components";

interface CommandersBarChartProps {
  commanders: Record<number, number>;
}

export const CommandersBarChart: React.FC<CommandersBarChartProps> = ({ commanders }) => {
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
      <Card bodyStyle={{ padding: 5 }}>
        <Avatar
          size={86}
          shape="square"
          src={iconPath}
          style={{ display: "inline-block", verticalAlign: "top" }}
        />
        <div style={{ display: "inline-block", paddingLeft: 5, maxWidth: 500 }}>
          <b>
            {commanderData.commanderName} - {toolTipData.value}{" "}
          </b>
          <br />
          <CommanderAbilitiesComponent commanderAbilities={commanderData.abilities} isSmall />
          <i>Click for more info ...</i>
        </div>
      </Card>
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
      colorBy={"indexValue"}
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
        window.open(routes.commanderByID(commanderData?.races[0], commanderId), "_blank");
      }}
    />
  );
};

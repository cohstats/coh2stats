"use client";

import { ResponsiveBar } from "@nivo/bar";
import React, { useMemo } from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";
import {
  convertBulletinIDToName,
  getBulletinData,
  getBulletinIconPath,
} from "../../coh/bulletins";
import { Avatar, Card } from "antd";

interface IProps {
  bulletins: Record<number, number>;
  filterMode?: "first-half" | "second-half" | "all";
}

export const BulletinsBarChart: React.FC<IProps> = ({ bulletins, filterMode = "first-half" }) => {
  const bulletinsData = useMemo(() => {
    const simpleBulletinData = [];

    for (const [key, value] of Object.entries(bulletins)) {
      simpleBulletinData.push({
        bulletinName: convertBulletinIDToName(key),
        value: value,
        bulletinId: key,
      });
    }

    const sortedData = sortArrayOfObjectsByTheirPropertyValue(
      simpleBulletinData as unknown as Array<Record<string, string>>,
    );

    // Apply filtering based on mode
    if (filterMode === "all") {
      return sortedData;
    }

    const halfLength = Math.ceil(sortedData.length / 2);

    if (filterMode === "first-half") {
      return sortedData.slice(halfLength);
    } else {
      // second-half
      return sortedData.slice(0, halfLength);
    }
  }, [bulletins, filterMode]);

  const toolTipFunction = (toolTipData: Record<string, any>) => {
    const bulletinData = getBulletinData(toolTipData.data.bulletinId);
    if (!bulletinData) return <div></div>;

    const iconPath = getBulletinIconPath(bulletinData?.icon);

    return (
      <Card styles={{ body: { padding: 5, width: 500 } }}>
        <Avatar
          size={54}
          shape="square"
          src={iconPath}
          style={{ display: "inline-block", verticalAlign: "top" }}
        />
        <div style={{ display: "inline-block", paddingLeft: 5, maxWidth: 500 }}>
          <b>
            {bulletinData.bulletinName} - {toolTipData.value}{" "}
          </b>
          <br />
          {bulletinData.descriptionShort}
        </div>
      </Card>
    );
  };

  return (
    // We have to use Bar chart instead of ResponsiveBar or it's not gonna render properly
    <ResponsiveBar
      margin={{ top: 0, right: 20, bottom: 40, left: 220 }}
      // @ts-ignore
      data={bulletinsData as data[] | undefined}
      layout={"horizontal"}
      keys={["value"]}
      indexBy="bulletinName"
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
    />
  );
};

import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import {
    convertCommanderIDToName,
    sortArrayOfObjectsByTheirPropertyValue,
} from "../../coh/helpers";

export const CommandersBarChart = (commanders: Record<number, number>) => {
    const simpleMapsData = [];

    for (const [key, value] of Object.entries(commanders)) {
        simpleMapsData.push({
            commanderName: convertCommanderIDToName((key as unknown) as number),
            value: value,
        });
    }

    const mapsData = sortArrayOfObjectsByTheirPropertyValue(
        (simpleMapsData as unknown) as Array<Record<string, string>>,
    );

    return (
        <ResponsiveBar
            height={600}
            width={1100}
            margin={{ top: 20, right: 20, bottom: 40, left: 220 }}
            // @ts-ignore
            data={mapsData as data[] | undefined}
            layout={"horizontal"}
            keys={["value"]}
            indexBy="commanderName"
            colors={{ scheme: "nivo" }}
            colorBy={"index"}
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

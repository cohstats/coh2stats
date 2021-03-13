import { Bar } from "@nivo/bar";
import React from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";
import { convertCommanderIDToName } from "../../coh/commanders";

export const CommandersBarChart = (commanders: Record<number, number>) => {
    const simpleMapsData = [];

    for (const [key, value] of Object.entries(commanders)) {
        simpleMapsData.push({
            commanderName: convertCommanderIDToName(key),
            commanderId: key,
            value: value,
        });
    }

    const mapsData = sortArrayOfObjectsByTheirPropertyValue(
        (simpleMapsData as unknown) as Array<Record<string, string>>,
    );

    return (
        <Bar
            height={800}
            width={750}
            margin={{ top: 0, right: 20, bottom: 40, left: 180 }}
            // @ts-ignore
            data={mapsData as data[] | undefined}
            layout={"horizontal"}
            keys={["value"]}
            indexBy="commanderName"
            colors={{ scheme: "nivo" }}
            colorBy={"index"}
            animate={false}
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
                // TODO: Fix this
                const cmId = event.data["commanderId"];
                window.open(`${window.location.hostname}/commanders/usf/${cmId}`);
            }}
        />
    );
};

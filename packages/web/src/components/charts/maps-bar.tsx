import { ResponsiveBar } from "@nivo/bar";
import React from "react";

const sortByAmountOfGames = (
    mapsData: Array<{ mapName: string; value: number }>,
): Array<{ mapName: string; value: number }> => {
    return mapsData.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    });
};

export const MapBarChart = (maps: Record<string, number>) => {
    let mapsData = Object.keys(maps).map((mapName) => {
        return {
            mapName: mapName,
            value: maps[mapName],
        };
    });
    mapsData = sortByAmountOfGames(mapsData);

    return (
        <ResponsiveBar
            height={600}
            width={1100}
            margin={{ top: 20, right: 20, bottom: 40, left: 220 }}
            // @ts-ignore
            data={mapsData as data[] | undefined}
            layout={"horizontal"}
            keys={["value"]}
            indexBy="mapName"
            colors={{ scheme: "nivo" }}
            colorBy={"index"}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                legend: "Number of games",
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

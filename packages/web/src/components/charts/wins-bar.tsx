import { ResponsiveBar } from "@nivo/bar";
import React from "react";

export const WinsChart = (data: Record<string, any>) => {
    const chartData = [
        { ...{ faction: "British", ...data["british"] } },
        { ...{ faction: "Soviet", ...data["soviet"] } },
        { ...{ faction: "USF", ...data["usf"] } },
        { ...{ faction: "Wermacht", ...data["wermacht"] } },
        { ...{ faction: "WGerman", ...data["wgerman"] } },
    ];

    return (
        <ResponsiveBar
            height={500}
            width={500}
            margin={{ top: 20, right: 80, bottom: 40, left: 40 }}
            // @ts-ignore
            data={chartData as data[] | undefined}
            layout={"vertical"}
            keys={["wins", "losses"]}
            indexBy="faction"
            colors={{ scheme: "nivo" }}
            colorBy={"id"}
            innerPadding={2}
            defs={[
                {
                    id: "green",
                    type: "linearGradient",
                    colors: [{ offset: 100, color: "#60BD68" }],
                },
                {
                    id: "red",
                    type: "linearGradient",
                    colors: [{ offset: 100, color: "#F15854" }],
                },
            ]}
            fill={[
                {
                    match: {
                        id: "wins",
                    },
                    id: "green",
                },
                {
                    match: {
                        id: "losses",
                    },
                    id: "red",
                },
            ]}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: "middle",
                legendOffset: -40,
            }}
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

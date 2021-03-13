import { Bar } from "@nivo/bar";
import React from "react";
import { sortArrayOfObjectsByTheirPropertyValue } from "../../coh/helpers";
import { convertBulletinIDToName } from "../../coh/bulletins";
import { Card } from "antd";

export const BulletinsBarChart = (bulletins: Record<number, number>) => {
    const simpleMapsData = [];

    for (const [key, value] of Object.entries(bulletins)) {
        simpleMapsData.push({
            bulletinName: convertBulletinIDToName(key),
            value: value,
        });
    }

    const mapsData = sortArrayOfObjectsByTheirPropertyValue(
        (simpleMapsData as unknown) as Array<Record<string, string>>,
    );

    // We have to use Bar chart instead of ResponsiveBar or it's not gonna render properly
    return (
        <Bar
            height={800}
            width={750}
            margin={{ top: 0, right: 20, bottom: 40, left: 220 }}
            // @ts-ignore
            data={mapsData as data[] | undefined}
            layout={"horizontal"}
            keys={["value"]}
            indexBy="bulletinName"
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
        />
    );
};

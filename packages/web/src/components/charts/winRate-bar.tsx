import { ResponsiveBar } from "@nivo/bar";
import React from "react";

const calculateWinRate = (data: { wins: number; losses: number }) => {
    return {
        winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
    };
};

export const WinRateChart = (data: Record<string, any>) => {
    const chartData = [
        { ...{ faction: "British", ...calculateWinRate(data["british"]) } },
        { ...{ faction: "Soviet", ...calculateWinRate(data["soviet"]) } },
        { ...{ faction: "USF", ...calculateWinRate(data["usf"]) } },
        { ...{ faction: "Wermacht", ...calculateWinRate(data["wermacht"]) } },
        { ...{ faction: "WGerman", ...calculateWinRate(data["wgerman"]) } },
    ];

    console.log(chartData);

    return (
        <ResponsiveBar
            height={500}
            width={500}
            margin={{ top: 20, right: 40, bottom: 40, left: 80 }}
            // @ts-ignore
            data={chartData as data[] | undefined}
            layout={"horizontal"}
            keys={["winRate"]}
            indexBy="faction"
            colors={{ scheme: "nivo" }}
            colorBy={"id"}
            minValue={0}
            maxValue={100}
            innerPadding={2}
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

import React, { useState } from "react";
import { PlayerCardDataArrayObject } from "../../../coh/types";
import { Card, Empty, Switch } from "antd";
import { DualAxes } from "@ant-design/plots";
import { firebaseTimeStampObjectToDate, getDatesInRange } from "../../../utils/helpers";
import { getDefaultSliderPosition } from "../../../utils/charts-utils";
import { Helper } from "../../../components/helper";

const DATA_CHART_WIDTH = 60;

interface IProps {
  record: PlayerCardDataArrayObject;
}

export const PlayerGroupHistoryChart: React.FC<IProps> = ({ record }) => {
  // If all dates are set we will generate data points for each date
  const [allDates, setAllDates] = useState(false);

  const data = record.historic?.history;

  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={"No historic data for this PlayerGroup"}
      />
    );
  }

  let chartData: string | any[] = [];

  if (allDates) {
    let dataArray: Array<{ time: Date; rank: number | null; level: number | null }> =
      getDatesInRange(firebaseTimeStampObjectToDate(data[0].ts), new Date()).map((d) => {
        return { time: d, rank: null, level: null };
      });
    const dateData = data.map((record) => {
      return {
        time: firebaseTimeStampObjectToDate(record.ts),
        rank: -record.r,
        level: record.rl,
      };
    });

    // console.log("DATADATA", dateData)
    dataArray = dataArray.concat(dateData);

    // console.log("DATAARRAY", dataArray)

    chartData = dataArray.sort((a, b) => {
      if (a.time < b.time) {
        return -1;
      } else {
        return 1;
      }
    });

    chartData = chartData.map((data) => {
      return {
        time: data.time.toLocaleDateString(),
        rank: data.rank,
        level: data.level,
      };
    });
  } else {
    chartData = data.map((record) => {
      return {
        time: firebaseTimeStampObjectToDate(record.ts).toLocaleDateString(),
        rank: -record.r,
        level: record.rl,
      };
    });
  }

  // @ts-ignore
  // chartData[4] = {...chartData[4], ...{rank: null}}

  // console.log(chartData)

  const chartConfig = {
    data: [chartData, chartData],
    padding: "auto" as "auto",
    xField: "time",
    yField: ["rank", "level"],
    geometryOptions: [{ connectNulls: true }, { connectNulls: true }],
    yAxis: {
      rank: {
        // connectNulls: true,
        // maxLimit: -1,
        label: {
          formatter: (record: any) => {
            return `${Math.round(Math.abs(record))}`;
          },
        },
      },
      level: {
        min: 1,
        max: 20,
      },
    },
    slider: getDefaultSliderPosition(chartData.length, DATA_CHART_WIDTH),
  };

  const onSwitchChange = (all: boolean) => {
    setAllDates(all);
  };

  const extra = (
    <>
      Display calendar dates{" "}
      <Helper
        text={
          "By default we chart only days when the playergroup played. All you can display all calendar days."
        }
      />{" "}
      <Switch
        // checkedChildren="All"
        // unCheckedChildren="Record"
        // style={{ width: 75 }}
        onChange={onSwitchChange}
        // defaultChecked={timestamp === "now"}
      />
    </>
  );

  return (
    <Card title={"History of Rank and Level"} extra={extra}>
      <DualAxes {...chartConfig} />
    </Card>
  );
};

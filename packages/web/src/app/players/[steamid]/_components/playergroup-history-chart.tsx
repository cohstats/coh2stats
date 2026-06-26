"use client";

import React from "react";
import { PlayerCardDataArrayObject } from "@/coh/types";
import { Card, Empty, Row, Col } from "antd";
import { ResponsiveLine } from "@nivo/line";
import { firebaseTimeStampObjectToDate } from "@/utils/helpers";

interface IProps {
  record: PlayerCardDataArrayObject;
}

export const PlayerGroupHistoryChart: React.FC<IProps> = ({ record }) => {
  const data = record.historic?.history;

  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={"No historic data for this PlayerGroup"}
      />
    );
  }

  const chartData: Array<{ x: string; y: number | null }> = data.map((record) => {
    return {
      x: firebaseTimeStampObjectToDate(record.ts).toLocaleDateString(),
      y: -record.r,
    };
  });

  const levelData: Array<{ x: string; y: number | null }> = data.map((record) => {
    return {
      x: firebaseTimeStampObjectToDate(record.ts).toLocaleDateString(),
      y: record.rl,
    };
  });

  const rankChartData = [
    {
      id: "rank",
      data: chartData,
    },
  ];

  const levelChartData = [
    {
      id: "level",
      data: levelData,
    },
  ];

  return (
    <Card title={"History of Rank and Level"}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div style={{ height: 300 }}>
            <h4 style={{ textAlign: "center", marginBottom: 8 }}>Rank</h4>
            <ResponsiveLine
              data={rankChartData}
              margin={{ top: 5, right: 20, bottom: 80, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                reverse: false,
              }}
              yFormat={(value) => Math.abs(Number(value)).toString()}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -25,
                legend: "Date",
                legendOffset: 40,
                legendPosition: "middle",
                tickValues:
                  chartData.length > 30
                    ? chartData
                        .filter((_, index) => index % Math.ceil(chartData.length / 15) === 0)
                        .map((d) => d.x)
                    : undefined,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Rank",
                legendOffset: -50,
                legendPosition: "middle",
                format: (value) => Math.abs(Number(value)).toString(),
              }}
              colors={{ scheme: "nivo" }}
              pointSize={6}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={false}
              useMesh={true}
              legends={[]}
            />
          </div>
        </Col>
        <Col xs={24}>
          <div style={{ height: 300 }}>
            <h4 style={{ textAlign: "center", marginBottom: 8 }}>Level</h4>
            <ResponsiveLine
              data={levelChartData}
              margin={{ top: 5, right: 20, bottom: 80, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: 1,
                max: 20,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -25,
                legend: "Date",
                legendOffset: 40,
                legendPosition: "middle",
                tickValues:
                  levelData.length > 30
                    ? levelData
                        .filter((_, index) => index % Math.ceil(levelData.length / 15) === 0)
                        .map((d) => d.x)
                    : undefined,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Level",
                legendOffset: -50,
                legendPosition: "middle",
              }}
              colors={{ scheme: "category10" }}
              pointSize={6}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={false}
              useMesh={true}
              legends={[]}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

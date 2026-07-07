"use client";

import React from "react";
import { Card, Row, Space, Typography } from "antd";
import { ResponsivePie } from "@nivo/pie";
import { LeaderboardPlayerCount } from "../page";
import { formatFactionName } from "@/utils/helpers";

const { Title, Paragraph } = Typography;

interface LeaderboardPieChartsProps {
  leaderboardData: LeaderboardPlayerCount[];
}

export const LeaderboardPieCharts = ({
  leaderboardData,
}: LeaderboardPieChartsProps): React.ReactElement => {
  // Calculate faction distribution for each game mode
  const getFactionDataForMode = (mode: string) => {
    const factionData: Array<{ id: string; label: string; value: number }> = [];

    leaderboardData.forEach((item) => {
      if (item.mode === mode) {
        factionData.push({
          id: item.faction,
          label: formatFactionName(item.faction),
          value: item.playerCount,
        });
      }
    });

    // Sort by standard faction order
    const factionOrder = ["usf", "british", "soviet", "wgerman", "wehrmacht"];
    return factionData.sort((a, b) => {
      return factionOrder.indexOf(a.id) - factionOrder.indexOf(b.id);
    });
  };

  const PieChart = ({ data, title }: { data: any[]; title: string }) => {
    return (
      <Card
        title={<div style={{ textAlign: "center" }}>{title}</div>}
        styles={{ body: { width: 280, height: 280, padding: 0 } }}
      >
        <ResponsivePie
          data={data}
          margin={{ bottom: 40, top: 10, right: 10, left: 10 }}
          innerRadius={0.4}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLabelsSkipAngle={10}
          enableArcLinkLabels={false}
          valueFormat={(value) => value.toLocaleString()}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 35,
              itemsSpacing: 0,
              itemWidth: 60,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 16px" }}>
      <Title level={2} style={{ textAlign: "center"}}>
        Faction Distribution by Game Mode
      </Title>
      <Paragraph style={{ textAlign: "center" }}>
        Displays how many players plays each faction - can be taken as popularity
      </Paragraph>

      <Row justify="center" gutter={[24, 24]}>
        <Space size="large" wrap style={{ display: "flex", justifyContent: "center", maxWidth: "100%" }}>
          <PieChart data={getFactionDataForMode("1v1")} title="1v1 Factions" />
          <PieChart data={getFactionDataForMode("2v2")} title="2v2 Factions" />
          <PieChart data={getFactionDataForMode("3v3")} title="3v3 Factions" />
          <PieChart data={getFactionDataForMode("4v4")} title="4v4 Factions" />
        </Space>
      </Row>
    </div>
  );
};

"use client";

import React, { useEffect } from "react";
import { Col, Typography, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { GeoWorldMap } from "@/components/charts/geo-map/geo-world-map";
import { Helper } from "@/components/helper";
import { AlertBox } from "@/components/alert-box";
import firebaseAnalytics from "../../../analytics";
import { PlayerStatsData } from "../../../coh/types";

const { Text, Title } = Typography;

interface PlayerStatsProps {
  initialData: PlayerStatsData | null;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ initialData }) => {
  useEffect(() => {
    firebaseAnalytics.playersPageDisplayed();
  }, []);

  if (!initialData) {
    return (
      <>
        <Row justify={"center"}>
          <AlertBox
            type={"warning"}
            message={"There was error loading overall player stats"}
            description={
              "Please try refreshing the page. If the error persists, please report it on our GitHub."
            }
          />
        </Row>
      </>
    );
  }

  const { count, last7days, last24hours, last30days, timeStamp, countries } = initialData;

  // Convert the timestamp from milliseconds to Date
  const timeStampDate = timeStamp ? new Date(timeStamp) : new Date();

  const convertedGeoData = [];
  for (const [key, value] of Object.entries(countries)) {
    convertedGeoData.push({
      id: key.toUpperCase(),
      value: value,
    });
  }

  return (
    <>
      <div>
        <Row justify={"center"}>
          <Col span={16} xs={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ marginBottom: 0, display: "inline" }}>
                  Total amount of tracked players{" "}
                  <Helper
                    text={
                      <>
                        We are tracking only players who played at least 1 automatch game. Players
                        who play only AI/Custom games are not tracked. Tracking from{" "}
                        {new Date(Date.UTC(2023, 0, 1, 0, 0)).toLocaleString()}. Data are
                        refreshed once a day. Current data timestamp{" "}
                        {timeStampDate.toLocaleString()}
                      </>
                    }
                  />
                </Title>{" "}
                <Text strong>
                  <UserOutlined /> {count.toLocaleString()}
                </Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ marginBottom: 0, display: "inline" }}>
                  Automatch players in the last 30 days
                </Title>{" "}
                <Text strong>
                  <UserOutlined /> {last30days.toLocaleString()}
                </Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ marginBottom: 0, display: "inline" }}>
                  Automatch players in the last 7 days
                </Title>{" "}
                <Text strong>
                  <UserOutlined /> {last7days.toLocaleString()}
                </Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ marginBottom: 0, display: "inline" }}>
                  Automatch players in the last 24 hours
                </Title>{" "}
                <Text strong>
                  <UserOutlined /> {last24hours.toLocaleString()}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <GeoWorldMap data={convertedGeoData} />
    </>
  );
};

export default PlayerStats;

"use client";

import MapStats from "./_components/map-stats";
import { ThemeProvider } from "next-themes";
import { ConfigProvider, theme } from "antd";

const MapStatsPage = () => {
  return (
    <ThemeProvider attribute="data-theme" forcedTheme="light">
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <div
          style={{
            backgroundColor: "#f0f2f5",
            color: "rgba(0, 0, 0, 0.88)",
            minHeight: "100vh",
          }}
        >
          <MapStats />
        </div>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default MapStatsPage;

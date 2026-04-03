// @ts-nocheck
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Loading: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
};

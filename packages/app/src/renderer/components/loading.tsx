import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Loading: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  return <Spin indicator={antIcon} style={{ margin: "auto", display: "block" }} />;
};

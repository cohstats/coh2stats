import React from "react";
import { Tooltip, theme } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IProps {
  text: string | React.ReactNode;
}
export const Helper: React.FC<IProps> = ({ text }) => {
  const { token } = theme.useToken();
  return (
    <Tooltip title={text}>
      <QuestionCircleOutlined style={{ color: token.colorTextSecondary }} />
    </Tooltip>
  );
};

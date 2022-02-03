import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IProps {
  text: string | any;
}
export const Helper: React.FC<IProps> = ({ text }) => {
  return (
    <Tooltip title={text}>
      <QuestionCircleOutlined />
    </Tooltip>
  );
};

import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IProps {
  text: string | any;
  style?: Record<string, any>;
}
export const Helper: React.FC<IProps> = ({ text, style }) => {
  return (
    <Tooltip title={text}>
      <QuestionCircleOutlined style={style} />
    </Tooltip>
  );
};

import React from "react";
import { theme, Typography } from "antd";
import { BulbOutlined } from "@ant-design/icons";
const { Text } = Typography;
interface IProps {
  text: string | any;
  style?: Record<string, any>;
}
export const Tip: React.FC<IProps> = ({ text, style }) => {
  const { token } = theme.useToken();
  return (
    <div style={style}>
      <BulbOutlined style={{ color: token.colorTextSecondary }} /> {<Text>{text}</Text>}
    </div>
  );
};

import React from "react";
import { BulbOutlined } from "@ant-design/icons";

interface IProps {
  text: string | any;
  style?: Record<string, any>;
}
export const Tip: React.FC<IProps> = ({ text, style }) => {
  return (
    <div style={style}>
      <BulbOutlined /> {text}
    </div>
  );
};

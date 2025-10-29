import React from "react";
import { commanderAndBulletinDate } from "../config";
import { Typography } from "antd";
interface IProps {
  typeOfData: string;
}
const { Text } = Typography;
export const ExportDate: React.FC<IProps> = ({ typeOfData }) => {
  return (
    <div style={{ textAlign: "center", fontStyle: "italic", padding: 10 }}>
      <Text>{typeOfData} data extracted from the game on {commanderAndBulletinDate}</Text>
    </div>
  );
};

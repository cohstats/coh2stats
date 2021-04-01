import React from "react";
import { commanderAndBulletinDate } from "../config";

interface IProps {
  typeOfData: string;
}
export const ExportDate: React.FC<IProps> = ({ typeOfData }) => {
  return (
    <div style={{ textAlign: "center", fontStyle: "italic", padding: 10 }}>
      {typeOfData} data extracted from the game on {commanderAndBulletinDate}
    </div>
  );
};

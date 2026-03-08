import { Card } from "antd";
import { BulletinsBarChart } from "../../../components/charts/bulletins-bar";
import React from "react";
import { TypeAnalysisObject } from "../../../coh/types";

interface IProps {
  data: TypeAnalysisObject;
  type: string;
  race: string;
  bodyStyle: Record<string, any>;
}

const BulletinCard: React.FC<IProps> = ({ data, type, race, bodyStyle }) => {
  const bulletinData = data["intelBulletins"][race as "soviet"];

  // Here are all the bulletin data
  // console.log(bulletinData)

  return (
    <Card title={`Intel Bulletins  ${type} - ${race}`} bodyStyle={bodyStyle}>
      <BulletinsBarChart bulletins={bulletinData} />
    </Card>
  );
};

export default BulletinCard;

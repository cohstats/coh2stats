import { Card } from "antd";
import { BulletinsBarChart } from "../../../components/charts/bulletins-bar";
import React, { useState } from "react";
import { TypeAnalysisObject } from "../../../coh/types";

interface IProps {
  data: TypeAnalysisObject;
  type: string;
  race: string;
  bodyStyle: Record<string, any>;
}


const BulletinCard: React.FC<IProps> = ({ data, type, race, bodyStyle }) => {
  const bulletinData = data["intelBulletins"][race as "soviet"];
  const [toggle, setToggle] = useState(true)

  // Here are all the bulletin data
  // console.log(bulletinData)

  const sliced = Object.fromEntries(
      Object.entries(bulletinData).slice(0, 20)
  )

  return (
    <Card title={`Intel Bulletins  ${type} - ${race}`} bodyStyle={bodyStyle}>
      <button onClick={() => setToggle(!toggle)}> Display Top 20</button>
      <BulletinsBarChart bulletins={toggle ? sliced : bulletinData} />

    </Card>
  );
};

export default BulletinCard;

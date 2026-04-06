import { Card, Button, Space } from "antd";
import { BulletinsBarChart } from "../../../components/charts/bulletins-bar";
import React, { useState } from "react";
import { TypeAnalysisObject } from "../../../coh/types";

interface IProps {
  data: TypeAnalysisObject;
  type: string;
  race: string;
  cardBodyStyles: Record<string, any>;
}

const BulletinCard: React.FC<IProps> = ({ data, type, race, cardBodyStyles }) => {
  const bulletinData = data["intelBulletins"][race as "soviet"];
  const [filterMode, setFilterMode] = useState<"first-half" | "second-half" | "all">(
    "first-half",
  );

  // Here are all the bulletin data
  // console.log(bulletinData)

  const buttonGroup = (
    <Space.Compact>
      <Button
        type={filterMode === "first-half" ? "primary" : "default"}
        onClick={() => setFilterMode("first-half")}
      >
        1/2
      </Button>
      <Button
        type={filterMode === "second-half" ? "primary" : "default"}
        onClick={() => setFilterMode("second-half")}
      >
        2/2
      </Button>
      <Button
        type={filterMode === "all" ? "primary" : "default"}
        onClick={() => setFilterMode("all")}
      >
        All
      </Button>
    </Space.Compact>
  );

  return (
    <Card
      title={`Intel Bulletins  ${type} - ${race}`}
      styles={{ body: cardBodyStyles }}
      extra={buttonGroup}
    >
      <BulletinsBarChart bulletins={bulletinData} filterMode={filterMode} />
    </Card>
  );
};

export default BulletinCard;

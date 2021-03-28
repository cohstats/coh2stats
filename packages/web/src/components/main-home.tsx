import React from "react";
import { Typography } from "antd";
import { useData, useLoading } from "../firebase";
import { Loading } from "./loading";
const { Title } = Typography;

const MainHome: React.FC = () => {
  const isLoading = useLoading("globalStats");
  const data: Record<string, any> = useData("globalStats");

  let analyzedMatches = <Loading />;

  if (!isLoading) {
    analyzedMatches = data["analyzedMatches"];
  }

  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <Title level={1} style={{ paddingTop: 25 }}>
        Company of Heroes 2 match statistics, charts and much more ...
      </Title>
      This is community site focused on providing insight into the current state of the game
      Company of Heroes 2.
      <br />
      <br />
      <Title level={4}>So far analyzed {analyzedMatches} matches.</Title>
    </div>
  );
};

export default MainHome;

import CustomSearch from "../../components/search/search";
import PlayerStats from "./_components/player-stats";
import { Col, Row } from "antd";
import { getPlayerStats } from "@/firebase/firebase-server";
import { Suspense } from "react";

// ISR configuration: revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

const PlayersPage = async () => {
  // Fetch player stats at build time / request time with ISR
  const playerStatsData = await getPlayerStats();

  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
          <CustomSearch />
        </Suspense>
      </div>
      <Row justify="center" style={{ minHeight: "600px" }}>
        <Col xs={23} md={22} xxl={15}>
          <PlayerStats initialData={playerStatsData} />
        </Col>
      </Row>
    </>
  );
};

export default PlayersPage;

"use client";

import CustomSearch from "../../_pages_old/search";
import PlayerStats from "../../_pages_old/players/stats/player-stats";
import { Col, Row } from "antd/es";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const PlayersPage = () => {
  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <CustomSearch />
      </div>
      <Row justify="center" style={{ minHeight: "600px" }}>
        <Col xs={23} md={22} xxl={15}>
          <PlayerStats />
        </Col>
      </Row>
    </>
  );
};

export default PlayersPage;

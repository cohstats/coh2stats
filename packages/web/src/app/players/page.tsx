"use client";

import CustomSearch from "../../components/search/search";
import PlayerStats from "./_components/player-stats";
import { Col, Row } from "antd";

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

import CustomSearch from "../search";
import PlayerStats from "./stats/player-stats";
import { Col, Row } from "antd/es";

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

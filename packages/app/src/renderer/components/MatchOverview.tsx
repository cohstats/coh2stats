import { Col, Row, Spin } from "antd";
import React from "react";
import { MatchData } from "../../redux/state";
import TeamView from "./TeamView";

interface Props {
  match: MatchData;
}

const MatchOverview: React.FC<Props> = ({match}) => {

  return (
    <div>
      <Row justify="center" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Col xs={24} md={22} xxl={14}>
        {match.display ? (
          <>
            <TeamView side={match.left}/>
            <h1>VS</h1>
            <TeamView side={match.right}/>
          </>
        ): (
          <>
            <h1><Spin size="large" />Scanning for a Match</h1>
          </>
        )}

      </Col>
      </Row>
    </div>
  );
}

export default MatchOverview;

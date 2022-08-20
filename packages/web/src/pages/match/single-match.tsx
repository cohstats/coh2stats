import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Loading } from "../../components/loading";
import { MatchPlayerDetailsTable } from "../matches/match-details-table";
import MatchDetails from "../matches/match-details";
import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import { ProcessedMatch } from "../../coh/types";
import {
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
} from "../../utils/table-functions";
import Title from "antd/es/typography/Title";
import { CountryFlag } from "../../components/country-flag";
import config from "../../config";
import { convertTeamNames } from "../players/helpers";
import { getGeneralIconPath } from "../../coh/helpers";
import { capitalize, timeAgo } from "../../utils/helpers";

const SingleMatch: React.FC = () => {
  const { matchID } = useParams<{
    matchID: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState<undefined | ProcessedMatch>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const matchDocRef = doc(getFirestore(), `matches/${matchID}/`);

      const matchDoc = await getDoc(matchDocRef);

      if (matchDoc.exists()) {
        setMatchData(matchDoc.data() as ProcessedMatch);
      } else {
        setMatchData(undefined);
      }
      setIsLoading(false);
    })();
  }, [matchID]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (!matchData) {
    return <></>;
  }

  return (
    <>
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Col xs={24} md={23} xxl={22}>
          <div>
            <div style={{ float: "left" }}>
              <Title level={2} style={{ marginBottom: 0, marginTop: "-7px" }}>
                Match details - {matchData.mapname}
              </Title>
            </div>
            <div style={{ float: "right", textAlign: "right" }}>
              Match type {formatMatchtypeID(matchData.matchtype_id)}
              <br />
              Map {matchData.mapname}
              <br />
              Played on {formatMatchTime(matchData.completiontime, true)}
              <br />
              Match duration {getMatchDuration(matchData.startgametime, matchData.completiontime)}
            </div>
          </div>
          <MatchDetails data={matchData || {}} />
        </Col>
      </Row>
    </>
  );
};

export default SingleMatch;

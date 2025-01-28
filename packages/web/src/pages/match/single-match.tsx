import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom-v5-compat";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Loading } from "../../components/loading";
import MatchDetails from "../matches/match-details";
import { Col, Empty, Image, Row, Tooltip, Typography } from "antd";
import { ProcessedMatch } from "../../coh/types";
import {
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
} from "../../utils/table-functions";
import Title from "antd/es/typography/Title";
import config from "../../config";
import { getMapIconPath } from "../../coh/maps";
import Link from "antd/es/typography/Link";
import { AlertBox } from "../../components/alert-box";
import firebaseAnalytics from "../../analytics";
import { DatabaseOutlined } from "@ant-design/icons";
import { COHStatsIcon } from "../../components/cohstats-icon";
import { differenceInDays } from "date-fns";

const { Text } = Typography;

const SingleMatch: React.FC = () => {
  const { matchID } = useParams<{
    matchID: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState<undefined | ProcessedMatch>();

  useEffect(() => {
    firebaseAnalytics.singleMatchPageDisplayed();

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

  let content: JSX.Element;

  if (isLoading) {
    content = (
      <div style={{ paddingTop: 100, paddingBottom: 100 }}>
        {" "}
        <Loading />
      </div>
    );
  } else if (!matchData) {
    content = (
      <div style={{ paddingTop: 25, paddingBottom: 100, textAlign: "center" }}>
        <AlertBox
          type={"error"}
          style={{ maxWidth: 650, margin: "0 auto" }}
          message={
            <>
              <Title level={2}> Match id {matchID} was not found</Title>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <Title level={5}> Possible reasons:</Title>
              <Text strong>Match is too new.</Text> <br />
              We are scraping matches every {config.scrapeFrequencyMinutes} minutes. Your match
              may appear soon if it's a new one.
              <br />
              <Text strong>Match is too old.</Text> <br />
              COH2 Stats are storing matches for only the last {config.matchAreStoredForDays}{" "}
              days.
              <br />
              <br />
              If you would like to increase the number of stored days please consider{" "}
              <Link href={config.donationLink} target="_blank" rel="noopener noreferrer" strong>
                <img
                  width={30}
                  height={30}
                  src={"/resources/kofi_s_logo_nolabel.webp"}
                  alt={"Ko-fi support button"}
                />
                Donate
              </Link>
            </>
          }
        />
      </div>
    );
  } else {
    const startgamedate = new Date(matchData.startgametime * 1000);
    const currentday = new Date();
    const days = config.matchAreStoredForDays - differenceInDays(currentday, startgamedate);
    const expiryDate = new Date(
      new Date().setDate(currentday.getDate() + days),
    ).toLocaleDateString();

    content = (
      <>
        <div style={{ height: 40 }}>
          <div style={{ float: "left" }}>
            <Title level={2} style={{ marginBottom: 0, marginTop: "-7px" }}>
              Match details - {matchData.mapname}
            </Title>
          </div>
          <div style={{ float: "right", textAlign: "right" }}>
            <Image
              src={getMapIconPath(matchData.mapname)}
              height={100}
              style={{ paddingBottom: 10, paddingLeft: 10, borderRadius: 4 }}
              alt={matchData.mapname}
              preview={false}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            />
          </div>
          <div style={{ float: "right", textAlign: "right" }}>
            Match type {formatMatchtypeID(matchData.matchtype_id)}
            <br />
            Map {matchData.mapname}
            <br />
            Match duration {getMatchDuration(matchData.startgametime, matchData.completiontime)}
            <br />
            Played on {formatMatchTime(matchData.completiontime, true)}
          </div>
        </div>
        <div style={{ paddingTop: 10 }}>
          <MatchDetails data={matchData || {}} />
        </div>
        <div style={{ textAlign: "right" }}>
          {" "}
          <br />
          <Tooltip
            title={`We store matches only for ${config.matchAreStoredForDays} days.
             This match is going to expire on ${expiryDate}.
              If you would like to increase this time please consider donating.`}
          >
            This match is going to expire in {days} days
          </Tooltip>{" "}
          <br />
          <DatabaseOutlined /> Data source <COHStatsIcon />
        </div>
      </>
    );
  }

  return (
    <>
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <Col xs={24} md={23} xxl={22}>
          {content}
        </Col>
      </Row>
    </>
  );
};

export default SingleMatch;

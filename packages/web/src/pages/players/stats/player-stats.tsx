import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Col, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { GeoWorldMap } from "../../../components/charts/geo-map/geo-world-map";
import { Row } from "antd/es";
import { Helper } from "../../../components/helper";
import { Loading } from "../../../components/loading";
import { AlertBox } from "../../../components/alert-box";
import { Link } from "react-router-dom-v5-compat";
import routes from "../../../routes";
import firebaseAnalytics from "../../../analytics";

const { Text, Title } = Typography;

type PlayerStatsType = {
  count: number;
  last24hours: number;
  last30days: number;
  last7days: number;
  timeStamp: Date;
  countries: Record<string, number>;
};

const PlayerStats: React.FC = () => {
  const [data, setData] = useState<null | PlayerStatsType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    firebaseAnalytics.playersPageDisplayed();

    try {
      (async () => {
        setIsLoading(true);
        const docRef = doc(getFirestore(), "stats", "playerStats");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { count, last24hours, last30days, last7days, timeStamp, countries } =
            docSnap.data();

          setData({
            count,
            last7days,
            last24hours,
            last30days,
            countries,
            // Convert the FB timestamp to regular date
            timeStamp: timeStamp.toDate(),
          });
        }
      })();
    } catch (e) {
      setError("Failed to load player stats");
      console.error("Failed to load player stats from firebase", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading || data === null) {
    return (
      <>
        <Row justify={"center"} style={{ paddingTop: 30 }}>
          <Loading />
        </Row>
      </>
    );
  }

  if (error || isLoading) {
    console.error(error);
    return (
      <>
        <Row justify={"center"}>
          <AlertBox
            type={"warning"}
            message={"There was error loading overall player stats"}
            description={
              <>
                If you are from China - this feature is not supported. See{" "}
                <Link to={routes.regionsBase()}>Regions page</Link> to learn more
              </>
            }
          />
        </Row>
      </>
    );
  }

  const { count, last7days, last24hours, last30days, timeStamp, countries } = data;

  const convertedGeoData = [];
  for (const [key, value] of Object.entries(countries)) {
    convertedGeoData.push({
      id: key.toUpperCase(),
      value: value,
    });
  }

  return (
    <>
      <div>
        <Row justify={"center"}>
          <Col span={16} xs={24}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: " [col1] 57% [col2] 40%",
                gridColumnGap: "20px",
              }}
            >
              <div style={{ gridColumn: 1, textAlign: "right" }}>
                {" "}
                <Title level={5}>
                  Total amount of tracked players{" "}
                  <Helper
                    text={
                      <>
                        We are tracking only players who played at least 1 automatch game. Players
                        who play only AI/Custom games are not tracked. Tracking from{" "}
                        {new Date(Date.UTC(2023, 0, 1, 0, 0)).toLocaleString()}. Data are
                        refreshed once a day. Current data timestamp {timeStamp.toLocaleString()}
                      </>
                    }
                  />
                </Title>
              </div>
              <div style={{ gridColumn: 2 }}>
                {" "}
                <Text strong>
                  <UserOutlined /> {count.toLocaleString()}
                </Text>
              </div>
              <div style={{ gridColumn: 1, textAlign: "right" }}>
                <Title level={5}>Automatch players in the last 30 days</Title>
              </div>
              <div style={{ gridColumn: 2 }}>
                {" "}
                <Text strong>
                  <UserOutlined /> {last30days.toLocaleString()}
                </Text>
              </div>
              <div style={{ gridColumn: 1, textAlign: "right" }}>
                <Title level={5}>Automatch players in the last &nbsp;7 days</Title>
              </div>
              <div style={{ gridColumn: 2 }}>
                {" "}
                <Text strong>
                  <UserOutlined /> {last7days.toLocaleString()}
                </Text>
              </div>
              <div style={{ gridColumn: 1, textAlign: "right" }}>
                <Title level={5}>Automatch players in the last 24 hours</Title>
              </div>
              <div style={{ gridColumn: 2 }}>
                {" "}
                <Text strong>
                  <UserOutlined /> {last24hours.toLocaleString()}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <GeoWorldMap data={convertedGeoData} />
    </>
  );
};

export default PlayerStats;

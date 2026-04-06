import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { Loading } from "../../../components/loading";
import { StatsDataObject, validStatsTypes } from "../../../coh/types";
import { useSearchParams } from "next/navigation";
import firebaseAnalytics from "../../../analytics";
import MapStatsDetails from "./map-stats-details";
import { fetchMapStatsData } from "../actions";

const { Title } = Typography;

interface IProps {
  urlChanger: Function;
}

const MapStatsGeneralDataProvider: React.FC<IProps> = ({ urlChanger }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Record<string, any>>();
  const searchParams = useSearchParams();

  const frequency = searchParams?.get("range") || "month";
  const timestamp = searchParams?.get("timeStamp") || "0000";
  const type = searchParams?.get("type") || "4v4";

  useEffect(() => {
    firebaseAnalytics.mapStatsDisplayed(frequency);
  }, [frequency, timestamp, type]);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      try {
        const statsData = await fetchMapStatsData(frequency, timestamp);

        if (statsData) {
          setData(statsData as StatsDataObject);
        } else {
          setData(undefined);
        }
      } catch (e) {
        console.error("Failed to get stats from firestore", e);
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [frequency, timestamp]);

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <Title level={4} style={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
        We are currently not tracking any records for the {`${frequency}`} stats on timestamp{" "}
        {`${timestamp}`}. <br />
        The statistics are run after the end of the day/week/month ~2AM UTC time.
      </Title>
    );
  }

  if (!validStatsTypes.includes(type)) {
    return (
      <Title level={4}>
        Unknown stats type {`${type}`}, valid values are {`${validStatsTypes}`}
      </Title>
    );
  }

  return (
    <>
      <MapStatsDetails urlChanger={urlChanger} specificData={data[type]} />
    </>
  );
};

export default MapStatsGeneralDataProvider;

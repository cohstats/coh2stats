import React, { useEffect } from "react";
import { Typography } from "antd";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { validStatsTypes } from "../../coh/types";
import { useLocation } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import firebaseAnalytics from "../../analytics";
import MapStatsDetails from "./map-stats-details";

const { Title } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface IProps {
  urlChanger: Function;
}

const MapStatsGeneralDataProvider: React.FC<IProps> = ({ urlChanger }) => {
  const isLoading = useLoading("mapStats");
  const data: Record<string, any> = useData("mapStats");
  const query = useQuery();

  const frequency = query.get("range") || "month";
  const timestamp = query.get("timeStamp") || "0000";
  const type = query.get("type") || "4v4";

  useEffect(() => {
    firebaseAnalytics.mapStatsDisplayed(frequency);
  }, [frequency, timestamp, type]);

  useFirestoreConnect([
    {
      collection: "stats",
      doc: frequency,
      subcollections: [
        {
          collection: timestamp,
          doc: "mapStats",
        },
      ],
      storeAs: "mapStats",
    },
  ]);

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

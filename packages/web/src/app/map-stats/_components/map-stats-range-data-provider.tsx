// @ts-nocheck
import React, { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { Typography } from "antd";
import { firebase } from "../../../firebase";

import { Loading } from "../../../components/loading";

import { validStatsTypes } from "../../../coh/types";
import { useSearchParams } from "next/navigation";
import MapStatsDetails from "./map-stats-details";

const { Title } = Typography;

interface IProps {
  urlChanger: Function;
}

const CustomMapStatsRangeDataProvider: React.FC<IProps> = ({ urlChanger }) => {
  const searchParams = useSearchParams();

  const [specificData, setSpecificData] = useState({});
  const [fullData, setFullData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const frequency = searchParams?.get("range") || "week";
  // const timestamp = searchParams?.get("timeStamp") || "0000";
  const type = searchParams?.get("type") || "4v4";
  // const race = searchParams?.get("race") || "wermacht";

  const fromTimeStamp = searchParams?.get("fromTimeStamp") || "";
  const toTimeStamp = searchParams?.get("toTimeStamp") || "";

  useEffect(() => {
    (async () => {
      if (!fromTimeStamp || !toTimeStamp) {
        return;
      }

      setIsLoading(true);

      try {
        const customAnalysis = httpsCallable(firebase.functions(), "getCustomAnalysis");

        // const customAnalysis = firebase.functions().httpsCallable("getCustomAnalysis");

        // Debug
        // console.log("CC-FROM", fromTimeStamp, new Date(parseInt(fromTimeStamp) * 1000));
        // console.log("CC-TO", toTimeStamp, new Date(parseInt(toTimeStamp) * 1000));

        const { data } = await customAnalysis({
          startDate: parseInt(fromTimeStamp),
          endDate: parseInt(toTimeStamp),
          type: "map",
        });

        // @ts-ignore
        const analysis = data["analysis"];

        // Debug
        // console.log("RE-FROM", fromTimeStamp, new Date(parseInt(data["fromTimeStamp"]) * 1000));
        // console.log("RE-TO", toTimeStamp, new Date(parseInt(data["toTimeStamp"]) * 1000));

        if (Object.keys(analysis).length < 1) {
          setError("Analysis found 0 records");
          return;
        }

        // Save the original data
        setFullData(analysis);

        const specificData: Record<string, any> = analysis[type];

        setSpecificData(specificData);

        setError("");
      } catch (e) {
        console.error(e);
        setError("There was an error generating the analysis");
      } finally {
        setIsLoading(false);
      }
    })();
    // We don't really want to track TYPE here. We used it to save time and setup specific data ASAP.
    // Although in this case this might not the be the best solution - however no time to test right now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTimeStamp, toTimeStamp]);

  useEffect(() => {
    if (isLoading) return;
    if (!specificData) return;

    setSpecificData(
      // @ts-ignore
      fullData[type],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (isLoading) return <Loading />;

  if (!specificData) {
    return (
      <div style={{ textAlign: "center" }}>
        <Title level={5}>Please select date range to trigger the load.</Title>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <Title level={5}>ERROR {error}</Title>
      </div>
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
      <MapStatsDetails urlChanger={urlChanger} specificData={specificData} />
    </>
  );
};

export default CustomMapStatsRangeDataProvider;

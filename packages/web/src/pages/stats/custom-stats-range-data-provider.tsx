import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { firebase } from "../../firebase";
import { Loading } from "../../components/loading";
import firebaseAnalytics from "../../analytics";

import {
  StatsDataObject,
  statTypesInDbAsType,
  TypeAnalysisObject,
  validStatsTypes,
} from "../../coh/types";
import { useLocation } from "react-router-dom";
import CustomStatsDetails from "./custom-stats-details";
import { StatsHeader } from "./stats-header";
import GeneralStats from "./general-stats";

const { Title } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface IProps {
  urlChanger: Function;
}

const CustomStatsRangeDataProvider: React.FC<IProps> = ({ urlChanger }) => {
  const query = useQuery();
  const statsSource: string | null = query.get("statsSource") ? query.get("statsSource") : "";

  const [fullData, setFullData] = useState<StatsDataObject | {}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const type = query.get("type") || "4v4";

  const fromTimeStamp = query.get("fromTimeStamp") || "";
  const toTimeStamp = query.get("toTimeStamp") || "";

  useEffect(() => {
    (async () => {
      if (!fromTimeStamp || !toTimeStamp) {
        return;
      }

      setIsLoading(true);
      firebaseAnalytics.rangeStatsDisplayed(statsSource || "");

      try {
        const customAnalysis = firebase.functions().httpsCallable("getCustomAnalysis");

        // Debug
        // console.log("CC-FROM", fromTimeStamp, new Date(parseInt(fromTimeStamp) * 1000));
        // console.log("CC-TO", toTimeStamp, new Date(parseInt(toTimeStamp) * 1000));

        const { data } = await customAnalysis({
          startDate: parseInt(fromTimeStamp),
          endDate: parseInt(toTimeStamp),
          type: statsSource === "top200" ? "top" : "normal",
        });

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

        setError("");
      } catch (e) {
        console.error(e);
        setError("There was an error generating the analysis");
      } finally {
        setIsLoading(false);
      }
    })();
    // We don't want to track TYPE as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTimeStamp, toTimeStamp, statsSource]);

  if (isLoading) return <Loading />;

  if (Object.entries(fullData).length < 2) {
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

  // @ts-ignore
  const specificData = { generalData: fullData[type as "1v1" | "2v2" | "3v3" | "4v4"] };

  if (type === "general") {
    return (
      <>
        <StatsHeader urlChanger={urlChanger} data={fullData as StatsDataObject} />
        <GeneralStats data={fullData as StatsDataObject} />
      </>
    );
  } else {
    return (
      <>
        <StatsHeader
          urlChanger={urlChanger}
          data={fullData as StatsDataObject}
          type={type as statTypesInDbAsType}
        />
        <CustomStatsDetails
          urlChanger={urlChanger}
          specificData={specificData as { generalData: TypeAnalysisObject }}
        />
      </>
    );
  }
};

export default CustomStatsRangeDataProvider;

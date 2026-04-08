import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { Loading } from "../../../components/loading";
import firebaseAnalytics from "../../../analytics";

import {
  StatsDataObject,
  statTypesInDbAsType,
  TypeAnalysisObject,
  validStatsTypes,
} from "../../../coh/types";
import { useSearchParams } from "next/navigation";
import CustomStatsDetails from "./custom-stats-details";
import { StatsHeader } from "./stats-header";
import GeneralStats from "./general-stats";
import { fetchCustomAnalysis } from "../actions";

const { Title } = Typography;

interface IProps {
  urlChanger: (params: Record<string, string | number | undefined>) => void;
}

const CustomStatsRangeDataProvider: React.FC<IProps> = ({ urlChanger }) => {
  const searchParams = useSearchParams();
  const statsSource: string | null = searchParams?.get("statsSource")
    ? searchParams?.get("statsSource")
    : "";

  const [fullData, setFullData] = useState<StatsDataObject | Record<string, never>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const type = searchParams?.get("type") || "4v4";

  const fromTimeStamp = searchParams?.get("fromTimeStamp") || "";
  const toTimeStamp = searchParams?.get("toTimeStamp") || "";

  useEffect(() => {
    (async () => {
      if (!fromTimeStamp || !toTimeStamp) {
        return;
      }

      setIsLoading(true);
      firebaseAnalytics.rangeStatsDisplayed(statsSource || "");

      try {
        const data = await fetchCustomAnalysis(
          parseInt(fromTimeStamp),
          parseInt(toTimeStamp),
          statsSource === "top200" ? "top" : "normal",
        );

        if (!data) {
          setError("There was an error generating the analysis");
          return;
        }

        // @ts-ignore
        const analysis = data["analysis"];

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

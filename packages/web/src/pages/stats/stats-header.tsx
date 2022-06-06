import React, { useEffect } from "react";
import { statsBase } from "../../titles";
import { capitalize, useQuery } from "../../utils/helpers";
import { Radio, RadioChangeEvent, Row, Tooltip, Typography } from "antd";
import PatchNotification from "../../components/patch-notifications";
import { StatsDataObject, statTypesInDbAsType } from "../../coh/types";
import { Helper } from "../../components/helper";

const { Text } = Typography;

interface IProps {
  urlChanger: Function;
  data: StatsDataObject;
  type?: statTypesInDbAsType;
}

const StatsHeader: React.FC<IProps> = ({ urlChanger, data }) => {
  const query = useQuery();

  const type = (query.get("type") as "1v1" | "2v2" | "3v3" | "4v4" | "general") || "4v4";
  const race = query.get("race") || "wermacht";
  const sourceIsAll = query.get("statsSource") !== "top200";

  const timestamp = query.get("timeStamp") || "";
  const fromTimeStamp = query.get("fromTimeStamp") || "";
  const toTimeStamp = query.get("toTimeStamp") || "";
  const frequency = query.get("range") || "";

  let totalGames: null | number = null;
  let matchCount = 0;
  if (type && type !== "general") {
    matchCount = data[type].matchCount;
    totalGames = data[type].totalGames || null;
  } else {
    matchCount =
      data["1v1"].matchCount +
      data["2v2"].matchCount +
      data["3v3"].matchCount +
      data["4v4"].matchCount;

    totalGames = 0;
    totalGames += data["1v1"].totalGames || 0;
    totalGames += data["2v2"].totalGames || 0;
    totalGames += data["3v3"].totalGames || 0;
    totalGames += data["4v4"].totalGames || 0;
    totalGames = totalGames === 0 ? null : totalGames;
  }

  // Page title
  useEffect(() => {
    // Set page title
    if (!document.title.includes(type) || !document.title.includes(race)) {
      document.title = `${statsBase} - ${capitalize(race)} - ${type}`;
    }
  }, [type, race]);

  const onTypeRadioChange = (e: RadioChangeEvent) => {
    urlChanger({
      typeToLoad: e.target?.value,
    });
  };

  const TypeSelector = ({ style }: { style: Record<string, any> }) => {
    return (
      <Radio.Group
        defaultValue={type}
        buttonStyle="solid"
        onChange={onTypeRadioChange}
        size={"large"}
        style={{ ...{ paddingBottom: 0 }, ...style }}
      >
        <Radio.Button value="general">General</Radio.Button>
        <Radio.Button value="1v1">1 vs 1</Radio.Button>
        <Radio.Button value="2v2">2 vs 2</Radio.Button>
        <Radio.Button value="3v3">3 vs 3</Radio.Button>
        <Radio.Button value="4v4">4 vs 4</Radio.Button>
      </Radio.Group>
    );
  };

  const GamesAnalyzed = () => {
    let gamesAnalyzed = <>Games analyzed {matchCount}</>;

    if (totalGames && totalGames > matchCount) {
      gamesAnalyzed = (
        <>
          Games analyzed {matchCount}/{totalGames} - {Math.round((matchCount / totalGames) * 100)}
          %{" "}
          <Helper
            text={
              "From June 2022 we are tracking 90% of total played automatch games. It's possible that some games which are under 10 minutes in duration are not counted."
            }
          />
        </>
      );
    }

    return gamesAnalyzed;
  };

  return (
    <>
      <Row justify={"center"}>
        <TypeSelector style={{ paddingLeft: 0 }} />
      </Row>
      <Row justify={"center"}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            <GamesAnalyzed />
          </span>
          <br />
          <span>
            {sourceIsAll && (
              <>
                This does not include all games which were played. See about page to understand
                the scope
                <br />
              </>
            )}
            {matchCount < 2000 && (
              <>
                This analysis has <Text strong>low amount of matches</Text>. The results might not
                be precise.
              </>
            )}
          </span>
        </div>
      </Row>
      <Row justify={"center"}>
        <Tooltip
          title={
            frequency !== "range"
              ? "It's possible that there are multiple patches in this analysis. Use custom range to display all patches."
              : ""
          }
        >
          <Text strong>This analysis includes games from these patches:</Text>
        </Tooltip>
      </Row>
      <PatchNotification
        params={{
          unixTimeStamp: timestamp,
          unixTimeStampFrom: fromTimeStamp,
          unixTimeStampTo: toTimeStamp,
        }}
      />
    </>
  );
};

export { StatsHeader };

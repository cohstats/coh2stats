import React, { useState } from "react";
import StatsDetails from "./stats-details";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase";
import routes from "../../routes";
import { ConfigProvider, Select, Space, Radio, Typography } from "antd";
import DatePicker from "../../components/date-picker";
import {
  convertDateToDayTimestamp,
  convertDateToStartOfMonth,
  getPreviousWeekTimeStamp,
  getStartOfTheWeek,
} from "../../helpers";
import { validRaceNames, validStatsTypes } from "../../coh/types";
import enGB from "antd/lib/locale/en_GB";

import { isBefore, isAfter } from "date-fns";
import { Helper } from "../../components/helper";
const { Link } = Typography;

type DatePickerType = "time" | "date" | "week" | "month" | "quarter" | "year" | undefined;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Stats: React.FC = () => {
  const { frequency, timestamp, type, race } =
    useParams<{
      frequency: string;
      timestamp: string;
      type: string;
      race: string;
    }>();
  const { push } = useHistory();
  const { Option } = Select;

  const query = useQuery();

  const statsSourceQuery = query.get("statsSource");

  let statDocToBeLoaded = "stats";
  if (statsSourceQuery === "top200") {
    statDocToBeLoaded = "topStats";
  }

  useFirestoreConnect([
    {
      collection: "stats",
      doc: frequency,
      subcollections: [
        {
          collection: timestamp,
          doc: statDocToBeLoaded,
        },
      ],
      storeAs: "stats",
    },
  ]);

  const settableFrequently = frequency ? frequency : "week";
  const [datePickerType, setDatePickerType] = useState(settableFrequently as DatePickerType);
  const [statsSource, setStatsSource] = useState(statsSourceQuery ? statsSourceQuery : "all");
  const [dateValue, setDateValue] = useState(
    timestamp
      ? new Date(parseInt(timestamp) * 1000)
      : new Date(getPreviousWeekTimeStamp() * 1000),
  );

  function disabledDate(current: Date) {
    // we started logging Monday 8.3.2021
    const canBeOld = isBefore(current, new Date(2021, 2, 8));
    const canBeNew = isAfter(current, new Date());

    return canBeOld || canBeNew;
  }

  function PickerWithType({ type, onChange }: { type: DatePickerType; onChange: any }) {
    // @ts-ignore
    let pickerType = type === "daily" ? "date" : type;

    return (
      // locale enGB for Monday as start of the week
      <ConfigProvider locale={enGB}>
        <DatePicker
          picker={pickerType}
          onChange={onChange}
          allowClear={false}
          defaultValue={dateValue}
          disabledDate={disabledDate}
          size={"large"}
        />
      </ConfigProvider>
    );
  }

  // I am not really sure about this workflow with useEffect and state for handling this
  // form. I feel like it's not optimal, something is wrong and there is definitely
  // better solution.
  React.useEffect(() => {
    let typeToLoad = "4v4";
    let raceToLoad = "wermacht";
    let searchValue = "";

    if (statsSource) {
      // We should not use it like this
      searchValue = `?${new URLSearchParams({ statsSource: statsSource }).toString()}`;
    }

    if (validStatsTypes.includes(type)) {
      typeToLoad = type;
    }

    if (validRaceNames.includes(race)) {
      raceToLoad = race;
    }

    push({
      pathname: routes.fullStatsDetails(
        datePickerType,
        convertDateToDayTimestamp(dateValue).toString(),
        typeToLoad,
        raceToLoad,
      ),
      search: searchValue,
    });
  }, [datePickerType, dateValue, push, statsSource]);

  const onDatePickerTypeSelect = (value: DatePickerType) => {
    if (value === "week") {
      setDateValue(getStartOfTheWeek(dateValue));
    } else if (value === "month") {
      setDateValue(convertDateToStartOfMonth(dateValue));
    }

    setDatePickerType(value);
  };

  const onDateSelect = (value: string) => {
    let actualDate: string | Date = value;

    if (datePickerType === "week") {
      actualDate = getStartOfTheWeek(value);
    } else if (datePickerType === "month") {
      actualDate = convertDateToStartOfMonth(value);
    }

    setDateValue(new Date(actualDate));
  };

  const onStatsSourceChange = (e: any) => {
    const {
      target: { value },
    } = e;
    if (value) {
      setStatsSource(value);
    } else {
      setStatsSource("all");
    }
  };

  return (
    <Switch>
      <Route path={routes.fullStatsDetails()}>
        <Space
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <Select
            value={datePickerType}
            onChange={onDatePickerTypeSelect}
            style={{ width: 100 }}
            size={"large"}
          >
            <Option value="daily">Daily</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option disabled={true} value="quarter">
              Quarter
            </Option>
            <Option disabled={true} value="year">
              Year
            </Option>
          </Select>
          <PickerWithType type={datePickerType} onChange={onDateSelect} />
          Ranking:
          <Radio.Group onChange={onStatsSourceChange} value={statsSource}>
            <Radio value={"all"}>
              All*{" "}
              <Helper
                text={
                  <>
                    This does not include all games played. Please see{" "}
                    <Link href={"/about"} target="_blank">
                      about page
                    </Link>{" "}
                    to fully understand which matches are included in this statistics.
                  </>
                }
              />
            </Radio>
            <Radio value={"top200"}>
              Top 200{" "}
              <Helper
                text={
                  <>
                    Includes only matches where all players have at least rank 200 for that
                    particular mode. For example 1v1, 2v2, 3v3, 4v4. See{" "}
                    <Link href={"/about#top200"} target="_blank">
                      about page
                    </Link>{" "}
                    to fully understand which matches are included in this statistics.
                  </>
                }
              />{" "}
            </Radio>
          </Radio.Group>
        </Space>
        <StatsDetails />
      </Route>
      <Route path={"/stats/"}>
        <Redirect
          to={routes.fullStatsDetails("week", getPreviousWeekTimeStamp(), "4v4", "wermacht")}
        />
      </Route>
    </Switch>
  );
};

export default Stats;

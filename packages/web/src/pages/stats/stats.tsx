import React, { useState } from "react";
import StatsDetails from "./stats-details";
import { Redirect, Route, Switch } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase";
import routes from "../../routes";
import { ConfigProvider, Select, Space } from "antd";
import DatePicker from "../../components/date-picker";
import { convertDateToDayTimestamp, getYesterdayDateTimestamp } from "../../helpers";
import { validRaceNames, validStatsTypes } from "../../coh/types";
import enGB from "antd/lib/locale/en_GB";

import { isBefore, isAfter } from "date-fns";

type DatePickerType = "time" | "date" | "week" | "month" | "quarter" | "year" | undefined;

const Stats: React.FC = () => {
  const { frequency, timestamp, type, race } = useParams<{
    frequency: string;
    timestamp: string;
    type: string;
    race: string;
  }>();
  const { push } = useHistory();
  const { Option } = Select;

  useFirestoreConnect([
    {
      collection: "stats",
      doc: frequency,
      subcollections: [
        {
          collection: timestamp,
          doc: "stats",
        },
      ],
      storeAs: "stats",
    },
  ]);

  const settableFrequently = frequency ? frequency : "daily";
  const [datePickerType, setDatePickerType] = useState(settableFrequently as DatePickerType);

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
          defaultValue={new Date(parseInt(timestamp) * 1000)}
          disabledDate={disabledDate}
          size={"large"}
        />
      </ConfigProvider>
    );
  }

  const onDateSelect = (value: string) => {
    let typeToLoad = "4v4";
    let raceToLoad = "wermacht";

    if (validStatsTypes.includes(type)) {
      typeToLoad = type;
    }

    if (validRaceNames.includes(race)) {
      raceToLoad = race;
    }

    push(
      routes.fullStatsDetails(
        datePickerType,
        convertDateToDayTimestamp(value).toString(),
        typeToLoad,
        raceToLoad,
      ),
    );
  };

  return (
    <Switch>
      <Route path={routes.fullStatsDetails()}>
        <Space
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <Select
            value={datePickerType}
            onChange={setDatePickerType}
            style={{ width: 100 }}
            size={"large"}
          >
            <Option value="daily">Daily</Option>
            <Option value="week">Week</Option>
            <Option disabled={true} value="month">
              Month
            </Option>
            <Option disabled={true} value="quarter">
              Quarter
            </Option>
            <Option disabled={true} value="year">
              Year
            </Option>
          </Select>
          <PickerWithType type={datePickerType} onChange={onDateSelect} />
        </Space>
        <StatsDetails />
      </Route>
      <Route path={"/stats/"}>
        <Redirect
          to={routes.fullStatsDetails("daily", getYesterdayDateTimestamp(), "4v4", "wermacht")}
        />
      </Route>
    </Switch>
  );
};

export default Stats;

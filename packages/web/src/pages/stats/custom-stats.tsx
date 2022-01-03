import React, { useState } from "react";
import { useHistory } from "react-router";
import routes from "../../routes";
import { ConfigProvider, Select, Space, Radio, Typography } from "antd";
import DatePicker from "../../components/date-picker";
import {
  convertDateToDayTimestamp,
  convertDateToMonthTimestamp,
  convertDateToStartOfMonth,
  getStartOfTheWeek,
  useQuery,
} from "../../utils/helpers";
import { RaceName, validRaceNames, validStatsTypes } from "../../coh/types";
import { getAllPatchDates } from "../../coh/patches";
import enGB from "antd/lib/locale/en_GB";

import { isBefore, isAfter } from "date-fns";
import { Helper } from "../../components/helper";
import CustomStatsRangeDataProvider from "./custom-stats-range-data-provider";
import CustomStatsGeneralDataProvider from "./custom-stats-general-data-provider";

const { Link } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

type DatePickerType = "time" | "date" | "week" | "month" | "range" | undefined;

const CustomStats: React.FC = () => {
  const { push } = useHistory();

  const query = useQuery();

  const statsSourceQuery = query.get("statsSource");
  const frequency = query.get("range") || "month";
  const timestamp = query.get("timeStamp") || `${convertDateToMonthTimestamp(new Date())}`;
  const type = query.get("type") || "4v4";
  const race: RaceName = (query.get("race") as RaceName) || "wermacht";

  const fromTimeStamp = query.get("fromTimeStamp") || "";
  const toTimeStamp = query.get("toTimeStamp") || "";

  const patchDates = getAllPatchDates();

  const [datePickerType, setDatePickerType] = useState(frequency as DatePickerType);
  const [statsSource, setStatsSource] = useState(statsSourceQuery ? statsSourceQuery : "all");
  const [dateValue, setDateValue] = useState(
    timestamp
      ? new Date(parseInt(timestamp) * 1000)
      : new Date(convertDateToMonthTimestamp(new Date()) * 1000),
  );

  const [rangeDate, setRangeDate] = useState(
    fromTimeStamp && toTimeStamp
      ? {
          fromDate: new Date(parseInt(fromTimeStamp) * 1000),
          toDate: new Date(parseInt(toTimeStamp) * 1000),
        }
      : {
          fromDate: new Date(),
          toDate: new Date(),
        },
  );

  const disabledDate = (current: Date) => {
    // we started logging Monday 8.3.2021
    const canBeOld = isBefore(current, new Date(2021, 2, 8));
    const canBeNew = isAfter(current, new Date());

    return canBeOld || canBeNew;
  };

  const PickerWithType = ({ type, onChange }: { type: DatePickerType; onChange: any }) => {
    // @ts-ignore
    let pickerType = type === "daily" ? "date" : type;

    if (pickerType === "range") {
      return <>ERROR</>;
    }
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
          dateRender={(current) => {
            const style = {
              border: "",
              borderRadius: "",
            };
            for (const date of patchDates) {
              if (
                date.getDate() === current.getDate() &&
                date.getMonth() === current.getMonth() &&
                date.getFullYear() === current.getFullYear()
              ) {
                style.border = "1px solid #1890ff";
                style.borderRadius = "50%";
              }
            }
            return (
              <div className="ant-picker-cell-inner" style={style}>
                {current.getDate()}
              </div>
            );
          }}
        />
      </ConfigProvider>
    );
  };

  const onRangePickerChange = (value: any) => {
    const from = (value && value[0]) || new Date();
    const to = (value && value[1]) || new Date();

    const fromDate = new Date(from);
    const toDate = new Date(to);

    setRangeDate({
      fromDate: fromDate,
      toDate: toDate,
    });

    changeStatsRoute({
      datePickerTypeToLoad: datePickerType,
      statsSourceToLoad: statsSource,
      fromTimeStampToLoad: convertDateToDayTimestamp(fromDate).toString(),
      toTimeStampToLoad: convertDateToDayTimestamp(toDate).toString(),
    });
  };

  const CustomRangePicker = ({ from, to }: { from: Date; to: Date }) => {
    return (
      <ConfigProvider locale={enGB}>
        <RangePicker
          allowClear={false}
          defaultValue={[from, to]}
          disabledDate={disabledDate}
          onChange={onRangePickerChange}
          size={"large"}
          dateRender={(current) => {
            const style = {
              border: "",
              borderRadius: "",
            };
            for (const date of patchDates) {
              if (
                date.getDate() === current.getDate() &&
                date.getMonth() === current.getMonth() &&
                date.getFullYear() === current.getFullYear()
              ) {
                style.border = "1px solid #1890ff";
                style.borderRadius = "50%";
              }
            }
            return (
              <div className="ant-picker-cell-inner" style={style}>
                {current.getDate()}
              </div>
            );
          }}
        />
      </ConfigProvider>
    );
  };

  const changeStatsRoute = (params: Record<string, any>) => {
    const {
      datePickerTypeToLoad,
      statsSourceToLoad,
      typeToLoad,
      raceToLoad,
      timeStampToLoad,
      fromTimeStampToLoad,
      toTimeStampToLoad,
    } = params;

    let searchValue;

    const typeOfStats = datePickerTypeToLoad || datePickerType;

    if (typeOfStats !== "range") {
      searchValue = `?${new URLSearchParams({
        range: datePickerTypeToLoad || (datePickerType as string),
        statsSource: statsSourceToLoad || statsSource,
        type: typeToLoad || type,
        race: raceToLoad || race,
        timeStamp: timeStampToLoad || timestamp,
      })}`;
    } else {
      searchValue = `?${new URLSearchParams({
        range: datePickerTypeToLoad || (datePickerType as string),
        statsSource: statsSourceToLoad || statsSource,
        type: typeToLoad || type,
        race: raceToLoad || race,
        fromTimeStamp: fromTimeStampToLoad || fromTimeStamp,
        toTimeStamp: toTimeStampToLoad || toTimeStamp,
      })}`;
    }

    push({
      pathname: routes.statsBase(),
      search: searchValue,
    });
  };

  // I am not really sure about this workflow with useEffect and state for handling this
  // form. I feel like it's not optimal, something is wrong and there is definitely
  // better solution.
  React.useEffect(() => {
    let typeToLoad = "4v4";
    let raceToLoad = "wermacht";

    if (validStatsTypes.includes(type)) {
      typeToLoad = type;
    }

    if (validRaceNames.includes(race)) {
      raceToLoad = race;
    }

    if (datePickerType !== "range") {
      changeStatsRoute({
        datePickerTypeToLoad: datePickerType,
        statsSourceToLoad: statsSource,
        typeToLoad,
        raceToLoad,
        timeStampToLoad: convertDateToDayTimestamp(dateValue).toString(),
      });
    } else {
      changeStatsRoute({
        datePickerTypeToLoad: datePickerType,
        statsSourceToLoad: statsSource,
        fromTimeStampToLoad: convertDateToDayTimestamp(rangeDate.fromDate).toString(),
        toTimeStampToLoad: convertDateToDayTimestamp(rangeDate.toDate).toString(),
      });
    }
    // We don't really want to track other things used here. Only the listed deps should invoke change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePickerType, dateValue, statsSource]);

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
    <div>
      <div>
        <Space
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}
          wrap
        >
          <Select
            value={datePickerType}
            onChange={onDatePickerTypeSelect}
            style={{ width: 150 }}
            size={"large"}
          >
            <Option value="daily">Daily</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="range">Custom Range</Option>
          </Select>
          {datePickerType !== "range" ? (
            <PickerWithType type={datePickerType} onChange={onDateSelect} />
          ) : (
            <CustomRangePicker from={rangeDate.fromDate} to={rangeDate.toDate} />
          )}
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
      </div>
      {datePickerType === "range" ? (
        <CustomStatsRangeDataProvider urlChanger={changeStatsRoute} />
      ) : (
        <CustomStatsGeneralDataProvider urlChanger={changeStatsRoute} />
      )}
    </div>
  );
};

export default CustomStats;

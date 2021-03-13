import React, { useState } from "react";
import StatsDetails from "./stats-details";
import { Route, Switch } from "react-router-dom";
import { useParams } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase";
import routes from "../../routes";
import { DatePicker, Row, Select, Space, TimePicker } from "antd";

const Stats: React.FC = () => {
  const { frequency, timestamp } = useParams<{
    frequency: string;
    timestamp: string;
  }>();

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

  const [type, setType] = useState(frequency);

  // @ts-ignore
  function PickerWithType({ type, onChange }) {
    return <DatePicker picker={type} onChange={onChange} size={"large"} />;
  }

  return (
    <Switch>
      <Route path={routes.fullStatsDetails()}>
        <Space>
          <Select value={type} onChange={setType} style={{ width: 100 }} size={"large"}>
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
          <PickerWithType type={type} onChange={(value: any) => console.log(value)} />
        </Space>
        <StatsDetails />
      </Route>
    </Switch>
  );
};

export default Stats;

import React, {useState} from "react";
import {PlayerCardDataArrayObject} from "../../../coh/types";
import {Card, Empty, Switch} from "antd";
import { Line } from '@ant-design/plots';
import {firebaseTimeStampObjectToDate, getDatesInRange} from "../../../utils/helpers";
import {getDefaultSliderPosition} from "../../../utils/charts-utils";
import {Helper} from "../../../components/helper";


interface IProps {
  record: PlayerCardDataArrayObject
}

export const PlayerGroupHistoryChart: React.FC<IProps> = ({record})=>{

  // If all dates are set we will generate data points for each date
  const [allDates, setAllDates] = useState(false)

  const data = record.historic?.history;

  if(!data){
    return   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No historic data for this PlayerGroup"}/>
  }

  if(allDates){
    getDatesInRange(firebaseTimeStampObjectToDate(data[0].ts), new Date())

  }

  const chartData = data.map((record) =>{
    return {
      time: firebaseTimeStampObjectToDate(record.ts).toLocaleDateString(),
      rank: -record.r
    }
  })

  // @ts-ignore
  // chartData[4] = {...chartData[4], ...{rank: null}}

  console.log(chartData)

  const chartConfig = {
    data: chartData,
    padding: 'auto' as "auto",
    xField: 'time',
    yField: 'rank',
    yAxis: {
      maxLimit: -1,
      label: {
        formatter: (record: any) => {return `${Math.round(Math.abs(record))}`}
      }
    },
    tooltip: {

    },
    slider: getDefaultSliderPosition(chartData.length, 30)
  };

  const onSwitchChange = (all: boolean) => {
    setAllDates(all)
  }

  const extra = (<>  Dates <Helper text={"sdfsdf"}/>   <Switch
    checkedChildren="All"
    unCheckedChildren="Record"
    style={{ width: 75 }}
    onChange={onSwitchChange}
    // defaultChecked={timestamp === "now"}
  />
  </>)

  return(
    <Card title={""} extra={extra}>
      <Line {...chartConfig} />
    </Card>
  )
}




import React from "react";
import {PlayerCardDataArrayObject} from "../../../coh/types";
import {Empty} from "antd";
import { Line } from '@ant-design/plots';
import {firebaseTimeStampObjectToDate} from "../../../utils/helpers";


interface IProps {
  record: PlayerCardDataArrayObject
}

export const PlayerGroupHistoryChart: React.FC<IProps> = ({record})=>{

  const data = record.historic?.history;

  if(!data){
    return   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No historic data for this PlayerGroup"}/>
  }

  console.log(data)

  const chartData = data.map((record) =>{
    return {
      time: firebaseTimeStampObjectToDate(record.ts).toLocaleDateString(),
      rank: -record.r
    }
  })

  console.log(chartData)

  const config = {
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
    slider: {
      start: 0,
      end: 1,
    },
  };


  return(
    <>
      <Line {...config} />
    </>
  )
}




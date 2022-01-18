import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMatch } from '../../../redux/slice';
import image from "../../../../assets/logoTrans.png";
import MatchOverview from '../../components/MatchOverview';

interface PlayerStats {
  rank: number;
  ranklevel: number;
  alias: string;
  streak: number;
  ratio: number;
}

const App = () => {
  const matchData = useSelector(selectMatch);
  const TableColumns: ColumnsType<PlayerStats> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 20,
    },
    {
      title: "Level",
      dataIndex: "rankLevel",
      key: "ranklevel",
      align: "center" as "center",
      responsive: ["xl"],
    },
    {
      title: "Alias",
      dataIndex: "members"
    }
  ]

  return (
    <>
      <MatchOverview match={matchData} />
    </>
  );
};

export default App;

/*
        <Row justify='center' style={{paddingTop: "20px"}}>
          <Col>
            <Table style={{overflow: "auto"}} />
          </Col>
        </Row>
        */

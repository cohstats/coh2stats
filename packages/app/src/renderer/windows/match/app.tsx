import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import image from "../../../../assets/logoTrans.png";

interface PlayerStats {
  rank: number;
  ranklevel: number;
  alias: string;
  streak: number;
  ratio: number;
}

const App = () => {

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
      <Row justify='center' style={{paddingTop: "20px"}}>
        <Col>
          <Table style={{overflow: "auto"}} />
        </Col>
      </Row>
      <h1>Hello from Match!</h1>
      <img src={image} />
    </>
  );
};

export default App;

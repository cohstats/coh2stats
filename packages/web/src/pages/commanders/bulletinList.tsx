import React, { useState,ReactNode } from "react";
import { Table, Tag, Space, Col, Row, Checkbox, Divider, Input } from 'antd';

import { useHistory } from "react-router";
import { IntelBulletinData, RaceName } from "../../coh/types";
import routes from "../../routes";
import { getAllBulletins, getBulletinsByRaces } from "../../coh/bulletins";
import { ColumnsType } from "antd/lib/table";
import Search from "antd/lib/input/Search";


export const BulletinList = () => {
  const { push } = useHistory();









  // prepare bulletin data
  let [bulletinData, setStateBulletinData] = useState(getAllBulletins());
  let [searchedValue, setSearchedValue] = useState('')

  const onExternalSearch = (value: any) => {
    console.log(value)
    setSearchedValue(value)
    if (value.length > 5) {
      return false
    }
    return true
  }

  // prepare table header
  const TableColumns: ColumnsType<IntelBulletinData> = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (_text: any, record: any) => {
        return (
          <div>
            <img src={"/resources/exportedIcons/" + record.icon + ".png"} height="64px" />
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'bulletinName',
      key: 'bulletinName',
      filters: [
        {
          text: searchedValue,
          value: searchedValue,
        }
      ],
      onFilter: (value: any, record: IntelBulletinData) => record.bulletinName.toLowerCase().includes(value.toLowerCase()) == true,
      sorter: (a: IntelBulletinData, b: IntelBulletinData) => a.bulletinName.length - b.bulletinName.length,
    },
    {
      title: 'Description',
      dataIndex: 'descriptionShort',
      key: 'descriptionShort',
    },
    {
      title: 'Races',
      key: 'races',
      dataIndex: 'races',
      filters: [
        {

          text: 'soviet',
          value: 'soviet',
        },
        {
          text: 'usf',
          value: 'usf',
        },
        {
          text: 'british',
          value: 'british',
        },
        {
          text: 'wermacht',
          value: 'wermacht',
        },
        {
          text: 'wgerman',
          value: 'wgerman',
        },
      ],
      onFilter: (value: any, record: IntelBulletinData) => record.races.indexOf(value) !== -1,
      sorter: (a: IntelBulletinData, b: IntelBulletinData) => a.races.length - b.races.length,
      render: (tags: any[]) => (
        <>
          <Space>
            {tags.sort().map(tag => {
              let color = 'geekblue';
              if (tag === 'wermacht' || tag === 'wgerman') {
                color = 'volcano';
              }
              return (

                <Tag color={color} key={tag} >
                  {tag.toUpperCase()}
                </Tag>

              );
            })}
          </Space>
        </>
      ),
    }
  ]




  return (

    <>
      <div>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={20} lg={12}>
            <div>
              <Search placeholder="Search by bulletin name" onSearch={onExternalSearch} />             
            </div>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={20} lg={12}>
            <Table columns={TableColumns}
              pagination={{ defaultPageSize: 60, pageSizeOptions: ['10', '20', '40', '60', '100', '200'] }}
              rowKey={record => record.serverID}
              expandable={{
                expandedRowRender: record => (<p>{record.descriptionLong}</p>),
                rowExpandable: record => record.descriptionLong.length !== 0,
                expandRowByClick: true,
                expandIconColumnIndex: -1
              }}
              dataSource={bulletinData} 
              />
              
          </Col>
        </Row>
      </div>
    </>
  );
};


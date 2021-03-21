import React, { useState } from "react";
import { Table, Tag, Space, Col, Row, Input, Button } from "antd";

import { useHistory } from "react-router";
import { IntelBulletinData } from "../../coh/types";
import routes from "../../routes";
import { getAllBulletins } from "../../coh/bulletins";
import { ColumnsType, ColumnType } from "antd/lib/table";
import Search from "antd/lib/input/Search";
import { SearchOutlined } from "@ant-design/icons";

export const BulletinList = () => {
  const { push } = useHistory();

  // prepare bulletin data
  let [bulletinData, setStateBulletinData] = useState(getAllBulletins());

  function tableColumnTextFilterConfig<T>(): ColumnType<T> {
    const searchInputHolder: { current: Input | null } = { current: null };
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => (searchInputHolder.current = node)}
              placeholder={"Search bulletin name"}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm({ closeDropdown: false })}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Button
              type="primary"
              onClick={() => confirm({ closeDropdown: true })}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button size="small" style={{ width: 90 }} onClick={clearFilters}>
              Reset
            </Button>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInputHolder.current?.select());
        }
      },
    };
  }

  // prepare table header
  const TableColumns: ColumnsType<IntelBulletinData> = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (_text: any, record: any) => {
        return (
          <div>
            <img
              src={"/resources/exportedIcons/" + record.icon + ".png"}
              height="64px"
              alt={record.icon}
            />
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "bulletinName",
      key: "bulletinName",
      ...tableColumnTextFilterConfig<IntelBulletinData>(),
      onFilter: (value: any, record: IntelBulletinData) =>
        record.bulletinName.toLowerCase().includes(value.toLowerCase()) === true,
      sorter: (a: IntelBulletinData, b: IntelBulletinData) =>
        a.bulletinName.length - b.bulletinName.length,
    },
    {
      title: "Description",
      dataIndex: "descriptionShort",
      key: "descriptionShort",
    },
    {
      title: "Races",
      key: "races",
      dataIndex: "races",
      filters: [
        {
          text: "soviet",
          value: "soviet",
        },
        {
          text: "usf",
          value: "usf",
        },
        {
          text: "british",
          value: "british",
        },
        {
          text: "wermacht",
          value: "wermacht",
        },
        {
          text: "wgerman",
          value: "wgerman",
        },
      ],
      onFilter: (value: any, record: IntelBulletinData) => record.races.indexOf(value) !== -1,
      sorter: (a: IntelBulletinData, b: IntelBulletinData) => a.races.length - b.races.length,
      render: (tags: any[]) => (
        <>
          <Space>
            {tags.sort().map((tag) => {
              let color = "geekblue";
              if (tag === "wermacht" || tag === "wgerman") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={20} lg={12}></Col>
        </Row>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={20} lg={12}>
            <Table
              columns={TableColumns}
              pagination={{
                defaultPageSize: 60,
                pageSizeOptions: ["10", "20", "40", "60", "100", "200"],
              }}
              rowKey={(record) => record.serverID}
              expandable={{
                expandedRowRender: (record) => <p>{record.descriptionLong}</p>,
                rowExpandable: (record) => record.descriptionLong.length !== 0,
                expandRowByClick: true,
                expandIconColumnIndex: -1,
              }}
              dataSource={bulletinData}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

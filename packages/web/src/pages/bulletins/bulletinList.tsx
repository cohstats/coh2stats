import React from "react";
import { Table, Tag, Space, Col, Row, Input, Button } from "antd";

import { IntelBulletinData } from "../../coh/types";
import { getAllBulletins, getBulletinIconPath } from "../../coh/bulletins";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { SearchOutlined } from "@ant-design/icons";
import { ExportDate } from "../../components/export-date";
import firebaseAnalytics from "../../analytics";
import { Tip } from "../../components/tip";
import { Link } from "react-router-dom";
import routes from "../../routes";

const BulletinList = () => {
  // Prepare bulletin data
  const bulletinData = getAllBulletins();

  firebaseAnalytics.bulletinsDisplayed();

  // search through provided bulletin data
  bulletinData.map((sortedBulletinItem) => {
    // if a bulletin belongs to more then 1 race, sort the races alphabetically
    if (sortedBulletinItem.races.length > 1) {
      sortedBulletinItem.races.sort((a, b) => {
        return a.localeCompare(b);
      });
    }
  });
  // sort alphabetically by the first race
  bulletinData.sort((a, b) => {
    return a.races[0].localeCompare(b.races[0]);
  });

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

  // Prepare table header
  const TableColumns: ColumnsType<IntelBulletinData> = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (_text: any, record: any) => {
        return (
          <div>
            <img src={getBulletinIconPath(record.icon)} height="64px" alt={record.name} />
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
        record.bulletinName.toLowerCase().includes(value.toLowerCase()),
      sorter: (a: IntelBulletinData, b: IntelBulletinData) =>
        a.bulletinName.localeCompare(b.bulletinName),
    },
    {
      title: "Description",
      dataIndex: "descriptionShort",
      key: "descriptionShort",
      responsive: ["md"],
    },
    {
      title: "Factions",
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
          <Space wrap>
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
          <Col xs={22} xxl={14}>
            <div style={{ textAlign: "center", paddingBottom: 10, fontSize: "larger" }}>
              <Tip
                text={
                  <>
                    You can see the most picked Intel Bulletins over at{" "}
                    <Link to={routes.statsBase()}>stats page</Link>.
                  </>
                }
              />
            </div>
            <Table
              columns={TableColumns}
              pagination={{
                defaultPageSize: 60,
                pageSizeOptions: ["10", "20", "40", "60", "100", "200"],
              }}
              rowKey={(record) => record.serverID}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    <b>{record.descriptionShort}</b>
                    <p>{record.descriptionLong}</p>
                  </div>
                ),
                rowExpandable: (record) => record.descriptionLong.length !== 0,
                expandRowByClick: true,
                expandIconColumnIndex: -1,
              }}
              dataSource={bulletinData}
            />
            <ExportDate typeOfData={"Intel bulletins"} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BulletinList;

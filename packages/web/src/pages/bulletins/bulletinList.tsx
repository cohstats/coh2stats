import React, { useEffect } from "react";
import { Table, Tag, Space, Col, Row, Input } from "antd";

import { IntelBulletinData } from "../../coh/types";
import { getAllBulletins, getBulletinIconPath } from "../../coh/bulletins";
import { ColumnsType } from "antd/lib/table";
import { ExportDate } from "../../components/export-date";
import firebaseAnalytics from "../../analytics";
import { Tip } from "../../components/tip";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { ChangeEvent } from "react";
import { useHistory } from "react-router";
import { useQuery } from "../../utils/helpers";

interface FilteredInfoState {
  icon?: string;
  bulletinName?: string;
  descriptionShort?: string;
  races?: string[];
}

const BulletinList = () => {
  const query = useQuery();
  const [filteredInfo, setFilteredInfo] = React.useState<FilteredInfoState>({});
  let timeout: any;

  const { push } = useHistory();

  const searchQuery = query.get("search") || "";

  const handleRaceFilter = (filters: any) => {
    setFilteredInfo({ ...filteredInfo, races: filters.races });
  };

  const changeRoute = (searchValue: string) => {
    push({
      pathname: routes.bulletinsBase(),
      search: `?search=${searchValue}`,
    });
  };

  const handleNameSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const targetValue = e.target.value;
      changeRoute(targetValue);
      handleSearch(targetValue, "bulletinName");
    }, 300);
  };

  const handleSearch = (value: string, column: string) =>
    setFilteredInfo({ ...filteredInfo, [column]: value });

  // Prepare bulletin data
  const bulletinData = getAllBulletins();

  useEffect(() => {
    firebaseAnalytics.bulletinsDisplayed();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery, "bulletinName");
    // We don't want to put handleSearch as part of the dependencies since it will cause this effect to run
    // multiple times as it's recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // sort alphabetically by the first race
  bulletinData.sort((a, b) => {
    return a.races[0].localeCompare(b.races[0]);
  });

  // function tableColumnTextFilterConfig<T>(): ColumnType<T> {
  //   const searchInputHolder: { current: Input | null } = { current: null };
  //   return {
  //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
  //       return (
  //         <div style={{ padding: 8 }}>
  //           <Input
  //             ref={(node) => (searchInputHolder.current = node)}
  //             placeholder={"Search bulletin name"}
  //             value={selectedKeys[0]}
  //             onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //             onPressEnter={() => confirm({ closeDropdown: false })}
  //             style={{ width: 188, marginBottom: 8, display: "block" }}
  //           />
  //           <Button
  //             type="primary"
  //             onClick={() => confirm({ closeDropdown: true })}
  //             icon={<SearchOutlined />}
  //             size="small"
  //             style={{ width: 90, marginRight: 8 }}
  //           >
  //             Search
  //           </Button>
  //           <Button size="small" style={{ width: 90 }} onClick={clearFilters}>
  //             Reset
  //           </Button>
  //         </div>
  //       );
  //     },
  //     filterIcon: (filtered) => (
  //       <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  //     ),
  //     onFilterDropdownVisibleChange: (visible) => {
  //       if (visible) {
  //         setTimeout(() => searchInputHolder.current?.select());
  //       }
  //     },
  //   };
  // }

  // Prepare table header
  const TableColumns: ColumnsType<IntelBulletinData> = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (_text: any, record: any) => {
        return (
          <div>
            <img
              src={getBulletinIconPath(record.icon)}
              height="64px"
              width="64px"
              alt={record.bulletinName}
            />
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "bulletinName",
      key: "bulletinName",
      filteredValue: filteredInfo?.bulletinName ? [filteredInfo.bulletinName] : null,
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
      filteredValue: filteredInfo?.races ? filteredInfo.races : null,
      onFilter: (value: any, record: IntelBulletinData) => {
        return record.races.indexOf(value) !== -1;
      },
      sorter: (a: IntelBulletinData, b: IntelBulletinData) => a.races.length - b.races.length,
      render: (tags: any[]) => (
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
      ),
    },
  ];

  return (
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
          <div style={{ textAlign: "center", paddingBottom: 10 }}>
            <Input
              placeholder="Search name"
              size="large"
              defaultValue={searchQuery}
              style={{ maxWidth: 400 }}
              onChange={handleNameSearch}
              allowClear
              autoFocus
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
            onChange={(pagination, filters, sorter) => handleRaceFilter(filters)}
          />
          <ExportDate typeOfData={"Intel bulletins"} />
        </Col>
      </Row>
    </div>
  );
};

export default BulletinList;

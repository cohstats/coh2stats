import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";

import { Table, Tag, Space, Col, Row, Input, Button, Tooltip } from "antd";

import { IntelBulletinData, LaddersDataArrayObject, LaddersDataObject } from "../../coh/types";
import { getAllBulletins, getBulletinIconPath } from "../../coh/bulletins";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { SearchOutlined } from "@ant-design/icons";
import { ExportDate } from "../../components/export-date";
import firebaseAnalytics from "../../analytics";
import { getPreviousWeekTimeStamp, getYesterdayDateTimestamp, useQuery } from "../../helpers";
import { useFirestoreConnect } from "react-redux-firebase";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { findAndMergeStatGroups } from "./helpers";

import en from "javascript-time-ago/locale/en";
import { CountryFlag } from "../../components/country-flag";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const Leaderboards = () => {
  firebaseAnalytics.leaderboardsDisplayed();

  const query = useQuery();
  const timestamp = query.get("timeStamp") || `${getYesterdayDateTimestamp()}`;
  const type = query.get("type") || "team2";
  const race = query.get("race") || "axis";

  const isLoading = useLoading("leaderboards");
  const data: LaddersDataObject = useData("leaderboards");
  const [tableData, setTableData] = useState<[] | Array<LaddersDataArrayObject>>([]);

  useFirestoreConnect([
    {
      collection: "ladders",
      doc: timestamp,
      subcollections: [
        {
          collection: type,
          doc: race,
        },
      ],
      storeAs: "leaderboards",
    },
  ]);

  useEffect(() => {
    if (data) {
      setTableData(findAndMergeStatGroups(data));
    }
  }, [data]);

  if (isLoading) return <Loading />;

  const TableColumns: ColumnsType<LaddersDataArrayObject> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 20,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.rank - b.rank,
    },
    { title: "Level", dataIndex: "ranklevel", key: "ranklevel", align: "center" as "center" },
    {
      title: "Alias",
      dataIndex: "members",
      key: "members",
      render: (data: any) => {
        return (
          <div>
            {data.map((playerInfo: Record<string, any>) => {
              return (
                <div>
                  <CountryFlag
                    countryCode={playerInfo["country"]}
                    style={{ width: "1.2em", height: "1.2em", paddingRight: 0 }}
                  />{" "}
                  {playerInfo["alias"]}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Streak",
      dataIndex: "streak",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.streak - b.streak,
      render: (data: any) => {
        if (data > 0) {
          return <>+{data}</>;
        } else {
          return <>{data}</>;
        }
      },
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.wins - b.wins,
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.losses - b.losses,
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center" as "center",
      width: 20,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => {
        return (
          Math.round(100 * Number(a.wins / (a.losses + a.wins))) -
          Math.round(100 * Number(b.wins / (b.losses + b.wins)))
        );
      },
      render: (data: any) => {
        return <div>{Math.round(100 * Number(data.wins / (data.losses + data.wins)))}%</div>;
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => {
        return a.wins + a.losses - (b.wins + b.losses);
      },
      render: (data: any) => {
        return <>{data.wins + data.losses}</>;
      },
    },
    {
      title: "Drops",
      dataIndex: "drops",
      key: "drops",
      align: "center" as "center",
      width: 20,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.drops - b.drops,
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.disputes - b.disputes,
      width: 20,
    },
    {
      title: "Last Game",
      dataIndex: "lastmatchdate",
      key: "lastmatchdate",
      align: "right" as "right",
      width: 120,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) =>
        a.lastmatchdate - b.lastmatchdate,
      render: (data: any) => {
        return (
          <Tooltip title={new Date(data * 1000).toLocaleString()}>
            {timeAgo.format(Date.now() - (Date.now() - data * 1000), "round-minute")}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={24} xxl={16}>
            <Table
              columns={TableColumns}
              pagination={{
                defaultPageSize: 60,
                pageSizeOptions: ["20", "40", "60", "100", "200"],
              }}
              rowKey={(record) => record?.rank}
              dataSource={tableData}
            />
            <ExportDate typeOfData={"Intel bulletins"} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Leaderboards;

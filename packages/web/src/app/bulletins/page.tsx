"use client";

import React, { useEffect, Suspense } from "react";
import { Table, Tag, Space, Col, Row, Input } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { IntelBulletinData } from "@/coh/types";
import { getAllBulletins, getBulletinIconPath } from "@/coh/bulletins";
import { TableColumnsType } from "antd";
import { ExportDate } from "@/components/export-date";
import { Tip } from "@/components/tip";
import routes from "../../routes";
import { ChangeEvent } from "react";

type ColumnsType<T> = TableColumnsType<T>;

interface FilteredInfoState {
  icon?: string;
  bulletinName?: string;
  descriptionShort?: string;
  races?: string[];
}

function BulletinListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredInfo, setFilteredInfo] = React.useState<FilteredInfoState>({});
  let timeout: any;

  const searchQuery = searchParams.get("search") || "";

  const handleRaceFilter = (filters: any) => {
    setFilteredInfo({ ...filteredInfo, races: filters.races });
  };

  const changeRoute = (searchValue: string) => {
    router.push(`${routes.bulletinsBase()}?search=${searchValue}`);
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
    if (typeof window !== "undefined") {
      import("../../analytics").then((module) => {
        module.default.bulletinsDisplayed();
      });
    }
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

  // Prepare table header
  const TableColumns: ColumnsType<IntelBulletinData> = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (_text: any, record: any) => {
        return (
          <div>
            <Image
              src={getBulletinIconPath(record.icon)}
              height={64}
              width={64}
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
                  <Link href={routes.statsBase()} prefetch={false}>
                    stats page
                  </Link>
                  .
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
            size={"middle"}
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
}

export default function BulletinList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BulletinListContent />
    </Suspense>
  );
}

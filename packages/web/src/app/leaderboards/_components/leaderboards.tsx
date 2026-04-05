// @ts-nocheck
import React, { useEffect, useState, Suspense } from "react";

import {
  Table,
  Space,
  Col,
  Row,
  Tooltip,
  ConfigProvider,
  Select,
  Typography,
  Switch,
} from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { LaddersDataArrayObject, LaddersDataObject } from "../../../coh/types";
import { getAllPatchDates } from "../../../coh/patches";
import { TableColumnsType } from "antd";
import firebaseAnalytics from "../../../analytics";
import {
  capitalize,
  convertDateToDayTimestamp,
  getYesterdayDateTimestamp,
  timeAgo,
} from "../../../utils/helpers";
import { CountryFlag } from "../../../components/country-flag";
import { leaderBoardsBase } from "../../../titles";
import enGB from "antd/locale/en_GB";

type ColumnsType<T> = TableColumnsType<T>;
import DatePicker from "../../../components/date-picker";

import routes from "../../../routes";
import {
  convertSteamNameToID,
  findAndMergeStatGroups,
  getGeneralIconPath,
  isTeamGame,
} from "../../../coh/helpers";
import { Helper } from "../../../components/helper";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { disabledDate, generateIconsForTitle } from "./leaderboard-components";
import { leaderboardsID } from "../../../coh/coh2-api";
import { fetchLiveLeaderboardData } from "../actions";

const { Text } = Typography;

const LeaderboardsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timestamp = searchParams?.get("timeStamp") || `now`;
  const historicTimestamp =
    searchParams?.get("historicTimeStamp") || `${getYesterdayDateTimestamp() - 86400}`;
  const type = searchParams?.get("type") || "1v1";
  const race = searchParams?.get("race") || "soviet";

  const patchDates = getAllPatchDates();

  const [selectedTimeStamp, setSelectedTimeStamp] = useState(timestamp);
  const [selectedHistoricTimeStamp, setHistoricTimeStamp] = useState(historicTimestamp);
  const [selectedType, setSelectedType] = useState(type);
  const [selectedRace, setSelectedRace] = useState(race);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [data, setData] = useState<LaddersDataObject>();
  const [dataHistoric, setDataHistoric] = useState<LaddersDataObject>();

  // Pagination state - only for live leaderboards
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(60);

  useEffect(() => {
    firebaseAnalytics.leaderboardsDisplayed();
  }, []);

  useEffect(() => {
    setIsLoadingData(true);

    try {
      (async () => {
        const ladderDocRef = doc(
          getFirestore(),
          `ladders/${selectedTimeStamp}/${selectedType}`,
          selectedRace,
        );
        const historicLadderDocRef = doc(
          getFirestore(),
          `ladders/${selectedHistoricTimeStamp}/${selectedType}`,
          selectedRace,
        );

        let ladderDocSnap;
        if (selectedTimeStamp !== "now") {
          ladderDocSnap = await getDoc(ladderDocRef);
          if (ladderDocSnap && ladderDocSnap.exists()) {
            setData(ladderDocSnap.data() as LaddersDataObject);
          } else {
            setData(undefined);
          }
        } else {
          // Fetch live data using server action with internal API and pagination
          const leaderboardID = leaderboardsID[selectedType][selectedRace];
          if (leaderboardID) {
            // Calculate start position: Relic API uses 1-based indexing
            const start = (currentPage - 1) * pageSize + 1;
            const finalData = await fetchLiveLeaderboardData(leaderboardID, start, pageSize);
            setData(finalData);
            // Disable the loading to fix the Chinese players
            setTimeout(() => {
              setIsLoadingData(false);
            }, 500);
          } else {
            setData(undefined);
          }
        }

        const historicLadderDocSnap = await getDoc(historicLadderDocRef);

        if (historicLadderDocSnap.exists()) {
          setDataHistoric(historicLadderDocSnap.data() as LaddersDataObject);
        } else {
          setDataHistoric(undefined);
        }
        setIsLoadingData(false);
      })();
    } catch (e) {
      setIsLoadingData(false);
      console.error("Failed to get the leaderboards", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTimeStamp,
    selectedHistoricTimeStamp,
    selectedRace,
    selectedType,
    currentPage,
    pageSize,
  ]);

  const divStyle = {
    backgroundImage: `url(${getGeneralIconPath(race)})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "350px",
    backgroundPosition: "left top 200px",
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(255,255,255,0.8)",
  };

  const changeLeaderBoardsRoute = (params: Record<string, any>) => {
    let { timeStampToLoad, typeToLoad, raceToLoad, historicTimeStampToLoad } = params;

    const searchValue = `?${new URLSearchParams({
      timeStamp: timeStampToLoad || selectedTimeStamp,
      type: typeToLoad || selectedType,
      race: raceToLoad || selectedRace,
      historicTimeStamp: historicTimeStampToLoad || selectedHistoricTimeStamp,
    })}`;

    router.push(`${routes.leaderboardsBase()}${searchValue}`);
  };

  const onSwitchChange = (liveGames: boolean) => {
    // Reset pagination when switching between live and historic
    setCurrentPage(1);
    if (liveGames) {
      changeLeaderBoardsRoute({ timeStampToLoad: "now" });
      setSelectedTimeStamp("now");
    } else {
      changeLeaderBoardsRoute({ timeStampToLoad: getYesterdayDateTimestamp() });
      setSelectedTimeStamp(`${getYesterdayDateTimestamp()}`);
    }
  };

  const TableColumns: ColumnsType<LaddersDataArrayObject> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 20,
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.rank - b.rank,
    },
    {
      title: "Level",
      dataIndex: "ranklevel",
      key: "ranklevel",
      align: "center" as "center",
      responsive: ["xl"],
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      align: "center" as "center",
      width: 110,
      responsive: ["xl"],
      render: (data: any) => {
        if (data > 0) {
          return <div style={{ color: "green" }}>+{data}</div>;
        } else if (data < 0) {
          return <div style={{ color: "red" }}>{data}</div>;
        } else if (data === "new") {
          return "new";
        } else if (data === "N/A") {
          return "N/A";
        }
      },
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => {
        if (Number.isInteger(a.change) && Number.isInteger(b.change)) {
          return (a.change as number) - (b.change as number);
        } else {
          return +1;
        }
      },
    },
    {
      title: "Alias",
      dataIndex: "members",
      key: "members",
      render: (data: any) => {
        return (
          <div>
            {data.map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id}>
                  <CountryFlag
                    countryCode={playerInfo["country"]}
                    style={{ width: "1.2em", height: "1.2em", paddingRight: 0 }}
                  />{" "}
                  <Link
                    href={routes.playerCardWithId(convertSteamNameToID(playerInfo["name"]))}
                    rel="nofollow noindex"
                    prefetch={false}
                  >
                    {playerInfo["alias"]}
                  </Link>
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
      key: "streak",
      align: "center" as "center",
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.streak - b.streak,
      render: (data: any) => {
        if (data > 0) {
          return <div style={{ color: "green" }}>+{data}</div>;
        } else {
          return <div style={{ color: "red" }}>{data}</div>;
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
      responsive: ["xl"],
      sorter: (a: LaddersDataArrayObject, b: LaddersDataArrayObject) => a.drops - b.drops,
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as "center",
      responsive: ["xl"],
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

  const CustomDatePicker = ({
    onChange,
    defaultValue,
    disabled,
  }: {
    onChange: any;
    defaultValue: Date;
    disabled?: boolean;
  }) => {
    return (
      <ConfigProvider locale={enGB}>
        <DatePicker
          onChange={onChange}
          allowClear={false}
          defaultValue={defaultValue}
          disabledDate={disabledDate}
          size={"large"}
          disabled={disabled}
          cellRender={(current) => {
            const style = {
              border: "",
              borderRadius: "",
            };
            for (const date of patchDates) {
              if (
                date.getDate() === current.getDate() &&
                date.getMonth() === current.getMonth() &&
                date.getFullYear() === current.getFullYear()
              ) {
                style.border = "1px solid #1890ff";
                style.borderRadius = "50%";
              }
            }
            return (
              <div className="ant-picker-cell-inner" style={style}>
                {current.getDate()}
              </div>
            );
          }}
        />
      </ConfigProvider>
    );
  };

  return (
    <>
      <div style={divStyle}>
        <Row justify="center" style={{ paddingTop: "20px" }}>
          <Col>
            <Space
              orientation={"horizontal"}
              wrap
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Switch
                checkedChildren="Live"
                unCheckedChildren={"Historic"}
                // style={{ width: 80 }}
                onChange={onSwitchChange}
                defaultChecked={timestamp === "now"}
              />
              <CustomDatePicker
                onChange={(value: any) => {
                  // Reset pagination when changing date
                  setCurrentPage(1);

                  setSelectedTimeStamp(convertDateToDayTimestamp(value).toString());
                  changeLeaderBoardsRoute({
                    timeStampToLoad: convertDateToDayTimestamp(value),
                  });
                  firebaseAnalytics.leaderboardsDateInteraction("regular");
                }}
                defaultValue={new Date(parseInt(selectedTimeStamp) * 1000)}
                disabled={timestamp === "now"}
              />
              <Select
                value={selectedType}
                onChange={(value) => {
                  // Reset pagination when changing leaderboard type
                  setCurrentPage(1);

                  let raceToLoad = selectedRace;
                  if (
                    (value === "team2" || value === "team3" || value === "team4") &&
                    selectedRace !== "allies"
                  ) {
                    if (
                      (value === "team2" || value === "team3" || value === "team4") &&
                      selectedRace !== "axis"
                    ) {
                      setSelectedRace("axis");
                      raceToLoad = "axis";
                    }
                  }

                  if (
                    (value === "1v1" || value === "2v2" || value === "3v3" || value === "4v4") &&
                    (selectedRace === "allies" || selectedRace === "axis")
                  ) {
                    setSelectedRace("soviet");
                    raceToLoad = "soviet";
                  }

                  changeLeaderBoardsRoute({ typeToLoad: value, raceToLoad });
                  setSelectedType(value);
                  firebaseAnalytics.leaderboardsTypeInteraction(value, selectedRace);
                }}
                style={{ width: 120 }}
                size="large"
                options={[
                  { value: "1v1", label: "1v1" },
                  { value: "2v2", label: "2v2" },
                  { value: "3v3", label: "3v3" },
                  { value: "4v4", label: "4v4" },
                  { value: "team2", label: "Team of 2" },
                  { value: "team3", label: "Team of 3" },
                  { value: "team4", label: "Team of 4" },
                ]}
              />
              <Select
                value={selectedRace}
                onChange={(value) => {
                  // Reset pagination when changing race
                  setCurrentPage(1);

                  changeLeaderBoardsRoute({ raceToLoad: value });
                  setSelectedRace(value);
                  firebaseAnalytics.leaderboardsTypeInteraction(selectedType, value);
                }}
                style={{ width: 130 }}
                size="large"
                options={
                  !isTeamGame(selectedType)
                    ? [
                        { value: "wehrmacht", label: "Wehrmacht" },
                        { value: "wgerman", label: "OKW" },
                        { value: "soviet", label: "Soviet" },
                        { value: "usf", label: "USF" },
                        { value: "british", label: "British" },
                      ]
                    : [
                        { value: "axis", label: "Axis" },
                        { value: "allies", label: "Allies" },
                      ]
                }
              />
              <div>
                in compare with{" "}
                <Helper
                  text={
                    <>
                      Change in rank in compare to rank standings on selected historic date.
                      <br />
                      <Text mark>new</Text> means the player was not in top 200 on the selected
                      historic date
                      <br />
                      <Text mark>N/A</Text> means the current rank is beyond 200 (historic data only
                      includes top 200)
                    </>
                  }
                />
              </div>
              <CustomDatePicker
                onChange={(value: any) => {
                  setHistoricTimeStamp(convertDateToDayTimestamp(value).toString());
                  changeLeaderBoardsRoute({
                    historicTimeStampToLoad: convertDateToDayTimestamp(value),
                  });
                  setSelectedTimeStamp(selectedTimeStamp);
                  firebaseAnalytics.leaderboardsDateInteraction("historic");
                }}
                defaultValue={new Date(parseInt(selectedHistoricTimeStamp) * 1000)}
              />
            </Space>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "10px", minHeight: "2500px" }}>
          <Col xs={24} xxl={17}>
            <div style={{ fontSize: "large", paddingBottom: 15, paddingTop: 15 }}>
              <div style={{ float: "left" }}>
                {generateIconsForTitle(selectedRace, selectedType)}{" "}
                <Text strong style={{ fontSize: "large" }}>
                  Leaderboards for {capitalize(selectedRace)} {selectedType}
                </Text>{" "}
                as of{" "}
                {`${
                  selectedTimeStamp === "now"
                    ? "now"
                    : new Date(parseInt(selectedTimeStamp) * 1000).toLocaleString()
                }`}{" "}
              </div>
              <div style={{ float: "right" }}>
                <Text strong style={{ fontSize: "large" }}>
                  {data?.rankTotal}
                </Text>{" "}
                ranked {isTeamGame(selectedType) ? "teams" : "players"}
              </div>
            </div>
            <Table
              style={{ minHeight: 600, overflow: "auto" }}
              columns={TableColumns}
              size={"middle"}
              pagination={
                selectedTimeStamp === "now"
                  ? {
                      // Server-side pagination for live leaderboards
                      current: currentPage,
                      pageSize: pageSize,
                      total: data?.rankTotal || 0,
                      showSizeChanger: true,
                      pageSizeOptions: ["40", "60", "100", "200"],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      onChange: (page, newPageSize) => {
                        setCurrentPage(page);
                        if (newPageSize !== pageSize) {
                          setPageSize(newPageSize);
                          setCurrentPage(1); // Reset to first page when page size changes
                        }
                      },
                    }
                  : {
                      // Client-side pagination for historic leaderboards (limited to 200 items)
                      defaultPageSize: 60,
                      pageSizeOptions: ["40", "60", "100", "200"],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }
              }
              rowKey={(record) => record?.rank}
              dataSource={findAndMergeStatGroups(data, dataHistoric)}
              loading={isLoadingData}
              scroll={{ x: 800 }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

const Leaderboards = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeaderboardsContent />
    </Suspense>
  );
};

export default Leaderboards;

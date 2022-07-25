import React, { useEffect, useState } from "react";

import { Table, Space, Col, Row, Tooltip, ConfigProvider, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import { isAfter, isBefore, isMonday } from "date-fns";
import { useHistory } from "react-router";

import { LaddersDataArrayObject, LaddersDataObject, RaceName } from "../../coh/types";
import { getAllPatchDates } from "../../coh/patches";
import { ColumnsType } from "antd/lib/table";
import firebaseAnalytics from "../../analytics";
import {
  capitalize,
  convertDateToDayTimestamp,
  getYesterdayDateTimestamp,
  timeAgo,
  useQuery,
} from "../../utils/helpers";
import { CountryFlag } from "../../components/country-flag";
import { leaderBoardsBase } from "../../titles";
import enGB from "antd/lib/locale/en_GB";
import DatePicker from "../../components/date-picker";

import routes from "../../routes";
import {
  convertSteamNameToID,
  findAndMergeStatGroups,
  getGeneralIconPath,
  isTeamGame,
} from "../../coh/helpers";
import { Helper } from "../../components/helper";
import subDays from "date-fns/subDays";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const { Text } = Typography;

const Leaderboards = () => {
  const { Option } = Select;

  const { push } = useHistory();
  const query = useQuery();
  const timestamp = query.get("timeStamp") || `${getYesterdayDateTimestamp()}`;
  const historicTimestamp =
    query.get("historicTimeStamp") || `${getYesterdayDateTimestamp() - 86400}`;
  const type = query.get("type") || "1v1";
  const race = query.get("race") || "soviet";

  const patchDates = getAllPatchDates();

  const [selectedTimeStamp, setSelectedTimeStamp] = useState(timestamp);
  const [selectedHistoricTimeStamp, setHistoricTimeStamp] = useState(historicTimestamp);
  const [selectedType, setSelectedType] = useState(type);
  const [selectedRace, setSelectedRace] = useState(race);

  // Set page title
  document.title = `${leaderBoardsBase} - ${capitalize(selectedType)} - ${capitalize(
    selectedRace,
  )}`;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [data, setData] = useState<LaddersDataObject>();
  const [dataHistoric, setDataHistoric] = useState<LaddersDataObject>();

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
        const ladderDocSnap = await getDoc(ladderDocRef);
        const historicLadderDocSnap = await getDoc(historicLadderDocRef);

        if (ladderDocSnap.exists() && historicLadderDocSnap.exists()) {
          setData(ladderDocSnap.data() as LaddersDataObject);
          setDataHistoric(historicLadderDocSnap.data() as LaddersDataObject);
        } else {
          setData(undefined);
          setDataHistoric(undefined);
        }
        setIsLoadingData(false);
      })();
    } catch (e) {
      console.error("Failed to get amount of analyzed matchess", e);
    }
  }, [selectedTimeStamp, selectedHistoricTimeStamp, selectedRace, selectedType]);

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

    push({
      pathname: routes.leaderboardsBase(),
      search: searchValue,
    });
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
                  <Link to={routes.playerCardWithId(convertSteamNameToID(playerInfo["name"]))}>
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

  const generateIconsForTitle = (race: string, type: string) => {
    if (isTeamGame(type)) {
      if (race === "axis") {
        return (
          <>
            <img src={getGeneralIconPath("wehrmacht")} height="24px" alt={race} />
            <img src={getGeneralIconPath("wgerman")} height="24px" alt={race} />
          </>
        );
      } else {
        return (
          <>
            <img src={getGeneralIconPath("soviet")} height="24px" alt={race} />
            <img src={getGeneralIconPath("british")} height="24px" alt={race} />
            <img src={getGeneralIconPath("usf")} height="24px" alt={race} />
          </>
        );
      }
    } else if (race !== "axis" && race !== "allies") {
      return <img src={getGeneralIconPath(race as RaceName)} height="24px" alt={race} />;
    }
  };

  const disabledDate = (current: Date) => {
    // we started logging Monday 8.3.2021
    const canBeOld = isBefore(current, new Date(2021, 2, 8));
    const canBeNew = isAfter(current, new Date());

    const isOldExceptMonday =
      current.getTime() < subDays(new Date(), 60).getTime() && !isMonday(current);

    return canBeOld || canBeNew || isOldExceptMonday;
  };

  const CustomDatePicker = ({
    onChange,
    defaultValue,
  }: {
    onChange: any;
    defaultValue: Date;
  }) => {
    return (
      <ConfigProvider locale={enGB}>
        <DatePicker
          onChange={onChange}
          allowClear={false}
          defaultValue={defaultValue}
          disabledDate={disabledDate}
          size={"large"}
          dateRender={(current) => {
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
              direction={"horizontal"}
              wrap
              style={{ display: "flex", justifyContent: "center" }}
            >
              <CustomDatePicker
                onChange={(value: any) => {
                  setSelectedTimeStamp(convertDateToDayTimestamp(`${value}`).toString());
                  changeLeaderBoardsRoute({
                    timeStampToLoad: convertDateToDayTimestamp(`${value}`),
                  });
                  firebaseAnalytics.leaderboardsDateInteraction("regular");
                }}
                defaultValue={new Date(parseInt(selectedTimeStamp) * 1000)}
              />
              <Select
                value={selectedType}
                onChange={(value) => {
                  changeLeaderBoardsRoute({ typeToLoad: value });
                  setSelectedType(value);
                  firebaseAnalytics.leaderboardsTypeInteraction(value, selectedRace);
                }}
                style={{ width: 120 }}
                size={"large"}
              >
                <Option value="1v1">1v1</Option>
                <Option value="2v2">2v2</Option>
                <Option value="3v3">3v3</Option>
                <Option value="4v4">4v4</Option>
                <Option value="team2">Team of 2</Option>
                <Option value="team3">Team of 3</Option>
                <Option value="team4">Team of 4</Option>
              </Select>
              <Select
                value={selectedRace}
                onChange={(value) => {
                  changeLeaderBoardsRoute({ raceToLoad: value });
                  setSelectedRace(value);
                  firebaseAnalytics.leaderboardsTypeInteraction(selectedType, value);
                }}
                style={{ width: 130 }}
                size={"large"}
              >
                {!isTeamGame(selectedType) ? (
                  <>
                    <Option value="wehrmacht">Wehrmacht</Option>
                    <Option value="wgerman">OKW</Option>
                    <Option value="soviet">Soviet</Option>
                    <Option value="usf">USF</Option>
                    <Option value="british">British</Option>
                  </>
                ) : (
                  <>
                    <Option value="axis">Axis</Option>
                    <Option value="allies">Allies</Option>
                  </>
                )}
              </Select>
              <div>
                in compare with{" "}
                <Helper
                  text={
                    <>
                      Change in rank in compare to rank standings on selected historic date.
                      <br />
                      <Text mark>new</Text> means the player was not in top 200 on the selected
                      historic date
                    </>
                  }
                />
              </div>
              <CustomDatePicker
                onChange={(value: any) => {
                  setHistoricTimeStamp(convertDateToDayTimestamp(`${value}`).toString());
                  changeLeaderBoardsRoute({
                    historicTimeStampToLoad: convertDateToDayTimestamp(`${value}`),
                  });
                  setSelectedTimeStamp(selectedTimeStamp);
                  firebaseAnalytics.leaderboardsDateInteraction("historic");
                }}
                defaultValue={new Date(parseInt(selectedHistoricTimeStamp) * 1000)}
              />
            </Space>
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "10px" }}>
          <Col xs={24} xxl={17}>
            <div style={{ fontSize: "large", paddingBottom: 15, paddingTop: 15 }}>
              <div style={{ float: "left" }}>
                {generateIconsForTitle(selectedRace, selectedType)}{" "}
                <Text strong>
                  Leaderboards for {capitalize(selectedRace)} {selectedType}
                </Text>{" "}
                as of {`${new Date(parseInt(selectedTimeStamp) * 1000).toLocaleString()}`}{" "}
              </div>
              <div style={{ float: "right" }}>
                <Text strong>{data?.rankTotal}</Text> ranked{" "}
                {isTeamGame(selectedType) ? "teams" : "players"}
              </div>
            </div>
            <Table
              style={{ minHeight: 600, overflow: "auto" }}
              columns={TableColumns}
              pagination={{
                defaultPageSize: 40,
                pageSizeOptions: ["20", "40", "60", "100", "200"],
              }}
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

export default Leaderboards;

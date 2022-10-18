import React, { useCallback, useEffect, useState } from "react";
import { Image, Table } from "antd";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  getCountFromServer,
} from "firebase/firestore";
import { ColumnsType } from "antd/es/table";
import {
  ExpandedMatch,
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  isMobileMediaQuery,
  raceIds,
} from "../../utils/table-functions";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { getMapIconPath } from "../../coh/maps";
import { AlertBox } from "../../components/alert-box";
import { Col, Row } from "antd/es";
import { useMediaQuery } from "react-responsive";
import Title from "antd/es/typography/Title";
import firebaseAnalytics from "../../analytics";
import { determineMatchWinner } from "../../utils/helpers";

const RecentMatches: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState<Array<Record<string, any>>>([]);
  const [error, setError] = useState<null | string>(null);
  const [totalMatches, setTotalMatches] = useState<string | number>("...");

  const isMobile = useMediaQuery({ query: isMobileMediaQuery });

  useEffect(() => {
    firebaseAnalytics.mostRecentGamesPageDisplayed();

    (async () => {
      setIsLoading(true);

      try {
        const matchesRef = collection(getFirestore(), "matches");

        const q = query(matchesRef, orderBy("completiontime", "desc"), limit(20));

        const [snapshot, querySnapshot] = await Promise.all([
          getCountFromServer(matchesRef),
          getDocs(q),
        ]);
        setTotalMatches(snapshot.data().count);

        const gamesData: Array<Record<string, any>> = [];
        querySnapshot.forEach((doc) => {
          gamesData.push(doc.data());
        });

        setMatchRecords(gamesData);
      } catch (e) {
        console.error(e);
        setError("There was error getting matches from COH2Stats DB, please report the issue.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const renderExpandedMatch = useCallback((record: any) => {
    return <ExpandedMatch record={record} />;
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "Played",
      dataIndex: "id",
      key: "id",
      align: "center" as "center",
      render: (_text: any, record: any) => {
        return <>{formatMatchTime(record.completiontime)}</>;
      },
    },
    {
      title: "Result",
      dataIndex: "matchhistoryreportresults",
      key: "result",
      align: "center" as "center",
      responsive: ["xl"],
      render: (data: any, record: any) => {
        return <>{determineMatchWinner(record).toUpperCase()}</>;
      },
    },
    {
      title: "Axis Players",
      key: "axis_players",
      dataIndex: "matchhistoryreportresults",
      render: (data: any, record: any) => {
        let axisPlayers = getMatchPlayersByFaction(data, "axis");
        return (
          <div>
            {axisPlayers.map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id}>
                  <img
                    key={playerInfo.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo.race_id], "small")}
                    height="20px"
                    alt={playerInfo.race_id}
                  />{" "}
                  <Link
                    to={routes.playerCardWithId(convertSteamNameToID(playerInfo.profile["name"]))}
                  >
                    {playerInfo.profile["alias"]}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Allies Players",
      key: "allies_players",
      dataIndex: "matchhistoryreportresults",
      render: (data: any, record: any) => {
        let alliesPlayers = getMatchPlayersByFaction(data, "allies");
        return (
          <div>
            {alliesPlayers.map((playerInfo: Record<string, any>) => {
              return (
                <div key={playerInfo.profile_id}>
                  <img
                    key={playerInfo.profile_id}
                    src={getGeneralIconPath(raceIds[playerInfo.race_id], "small")}
                    height="20px"
                    alt={playerInfo.race_id}
                  />{" "}
                  <Link
                    to={routes.playerCardWithId(convertSteamNameToID(playerInfo.profile["name"]))}
                  >
                    {playerInfo.profile["alias"]}
                  </Link>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Map",
      dataIndex: "mapname",
      key: "mapname",
      align: "left" as "left",
      responsive: ["lg"],
      render: (text: any, record: any) => {
        return (
          <>
            <Image
              src={getMapIconPath(record.mapname, "x64")}
              height={40}
              width={40}
              style={{ borderRadius: 4 }}
              alt={record.mapname}
              preview={false}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            />{" "}
            {record.mapname}
          </>
        );
      },
    },
    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
      align: "center" as "center",
      responsive: ["xl"],
      render: (_text: any, record: any) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <div>{formatMatchtypeID(record.matchtype_id)}</div>
              <sub> {record.description.toLowerCase()} </sub>
            </div>
          </>
        );
      },
    },
    {
      title: "Match duration",
      dataIndex: "matchduration",
      key: "matchduration",
      align: "center" as "center",
      responsive: ["xl"],
      render: (_text: any, record: any) => {
        return <p>{getMatchDuration(record.startgametime, record.completiontime)}</p>;
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const Content = (() => {
    if (error) {
      return (
        <div style={{ paddingTop: 40, overflow: "auto" }}>
          <AlertBox type={"error"} message={error} />
        </div>
      );
    } else {
      return (
        <Table
          style={{ paddingTop: 5, overflow: "auto" }}
          loading={isLoading}
          // @ts-ignore
          //onChange={handleTableChange}
          pagination={false}
          columns={columns}
          dataSource={matchRecords}
          rowKey={(record) => record.id}
          size="middle"
          expandable={{
            expandedRowRender: renderExpandedMatch,
            rowExpandable: (_) => !isMobile,
            expandRowByClick: true,
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={columns.length}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div>Displaying {matchRecords.length} most recent games</div>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      );
    }
  })();

  return (
    <Row justify="center" style={{ paddingTop: "10px" }}>
      <Col xs={23} md={22} xxl={15}>
        <div style={{ textAlign: "center" }}>
          <Title>Most recent games</Title>
          <Title level={5}>Currently {totalMatches} games are stored in our database</Title>
        </div>
        {Content}
      </Col>
    </Row>
  );
};

export default RecentMatches;

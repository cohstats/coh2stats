import React, { useCallback, useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
  DocumentData,
} from "firebase/firestore";
import { Button, Table, Tag, Tooltip, Typography } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  ExpandedMatch,
  formatMatchTime,
  formatMatchtypeID,
  getMatchDuration,
  getMatchPlayersByFaction,
  getRaceImage,
  isMobileMediaQuery,
  raceIds,
} from "../../utils/table-functions";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { useMediaQuery } from "react-responsive";
import { BulbOutlined, DatabaseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { COHStatsIcon } from "../../components/cohstats-icon";
import { AlertBox } from "../../components/alert-box";
import firebaseAnalytics from "../../analytics";

const { Text } = Typography;

const perPage = 20;

interface IProps {
  steamID: string;
}

const AllMatchesTable: React.FC<IProps> = ({ steamID }) => {
  const profileID = `/steam/${steamID}`;

  const isMobile = useMediaQuery({ query: isMobileMediaQuery });

  const [isLoading, setIsLoading] = useState(true);
  const [matchRecords, setMatchRecords] = useState<Array<Record<string, any>>>([]);
  const [lastVisibleDocRef, setLastVisibleDocRef] = useState<DocumentData | undefined>();
  const [error, setError] = useState<null | string>(null);
  const [amountOfNewGamesLoaded, setAmountOfNewGamesLoaded] = useState(-1);

  // -1 doesn't exist, that's our value for ANY
  const [filterMatchType, setFilterMatchType] = useState<Array<number> | null>(null);

  useEffect(() => {
    (async () => {
      firebaseAnalytics.playerCardCOHStatsMatchesDisplayed();

      setIsLoading(true);
      // Reset the state
      setAmountOfNewGamesLoaded(-1);
      try {
        const matchesRef = collection(getFirestore(), "matches");

        const q = (() => {
          if (filterMatchType === null)
            return query(
              matchesRef,
              orderBy("startgametime", "desc"),
              where("steam_ids", "array-contains", `${steamID}`),
              limit(perPage),
            );
          else {
            return query(
              matchesRef,
              orderBy("startgametime", "desc"),
              where("steam_ids", "array-contains", `${steamID}`),
              where("matchtype_id", "in", filterMatchType),
              limit(perPage),
            );
          }
        })();

        const querySnapshot = await getDocs(q);

        // Last visible document for pagination
        setLastVisibleDocRef(querySnapshot.docs[querySnapshot.docs.length - 1]);

        const gamesData: Array<Record<string, any>> = [];
        querySnapshot.forEach((doc) => {
          gamesData.push(doc.data());
        });

        console.log("creating a completly new array", gamesData.length);

        setMatchRecords(gamesData);
      } catch (e) {
        console.error(e);
        setError(
          "There was error getting player matches from COH2Stats DB, please report the issue.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [steamID, filterMatchType]);

  const loadMoreGames = async () => {
    setIsLoading(true);
    firebaseAnalytics.playerCardCOHStatsMatchesMoreGames();
    try {
      const matchesRef = collection(getFirestore(), "matches");

      const q = (() => {
        if (filterMatchType === null)
          return query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", `${steamID}`),
            startAfter(lastVisibleDocRef),
            limit(perPage),
          );
        else {
          return query(
            matchesRef,
            orderBy("startgametime", "desc"),
            where("steam_ids", "array-contains", `${steamID}`),
            where("matchtype_id", "in", filterMatchType),
            startAfter(lastVisibleDocRef),
            limit(perPage),
          );
        }
      })();

      const querySnapshot = await getDocs(q);
      // Last visible document for pagination
      setLastVisibleDocRef(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setAmountOfNewGamesLoaded(querySnapshot.docs.length);

      // We need to create a new reference
      const gamesData = matchRecords.slice();
      querySnapshot.forEach((doc) => {
        gamesData.push(doc.data());
      });

      setMatchRecords(gamesData);
    } catch (e) {
      console.error(e);
      setError(
        "There was error getting player matches from COH2Stats DB, please report the issue.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableChange = (
    _newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    _sorter: SorterResult<any>,
  ) => {
    setFilterMatchType((filters["matchtype_id"] as Array<number>) || null);
  };

  function getPlayerMatchHistoryResult(matchRecord: any) {
    let player = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name === profileID,
    );
    return player[0];
  }

  function isPlayerVictorious(matchRecord: any): boolean {
    if (!matchRecord) return false;

    let resultItem = matchRecord.matchhistoryreportresults.filter(
      (result: any) => result.profile.name === profileID,
    );
    return resultItem[0].resulttype === 1;
  }

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
        let player = getPlayerMatchHistoryResult(record);
        return (
          <>
            <div>
              <Tooltip title={player.profile.alias} key={player.profile.alias}>
                <img
                  key={player.profile_id}
                  src={getRaceImage(raceIds[player.race_id])}
                  height="48px"
                  width="48px"
                  alt={player.race_id}
                />
              </Tooltip>
            </div>
            <div>
              <sub> {formatMatchTime(record.completiontime)} </sub>
            </div>
          </>
        );
      },
    },
    {
      title: "Result",
      dataIndex: "matchhistoryreportresults",
      key: "result",
      align: "center" as "center",
      responsive: ["xl"],
      render: (data: any, record: any) => {
        if (isPlayerVictorious(record)) {
          return <Tag color={"#108ee9"}>VICTORY</Tag>;
        } else {
          return <Tag color={"#f50"}>DEFEAT</Tag>;
        }
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
                    {playerInfo.profile.name === profileID ? (
                      <b>{playerInfo.profile["alias"]}</b>
                    ) : (
                      playerInfo.profile["alias"]
                    )}
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
                    {playerInfo.profile.name === profileID ? (
                      <b>{playerInfo.profile["alias"]}</b>
                    ) : (
                      playerInfo.profile["alias"]
                    )}
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
    },
    {
      title: "Mode",
      dataIndex: "matchtype_id",
      key: "matchtype_id",
      align: "center" as "center",
      responsive: ["xl"],
      filters: [
        {
          text: "1 vs 1",
          value: 1,
        },
        {
          text: "2 vs 2",
          value: 2,
        },
        {
          text: "3 vs 3",
          value: 3,
        },
        {
          text: "4 vs 4",
          value: 4,
        },
      ],
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
    const addedGames = (() => {
      if (amountOfNewGamesLoaded === -1) {
        return "";
      } else {
        return (
          <Text type="success" strong>
            , +{amountOfNewGamesLoaded}
          </Text>
        );
      }
    })();

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
          onChange={handleTableChange}
          pagination={false}
          columns={columns}
          dataSource={matchRecords}
          rowKey={(record) => record.id}
          size="middle"
          rowClassName={(record) => (isPlayerVictorious(record) ? "green" : "red")}
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
                    <div>
                      Currently loaded: {matchRecords.length} matches{addedGames}
                    </div>
                    <div>
                      {" "}
                      {amountOfNewGamesLoaded !== 0 && (
                        <Button
                          type={"primary"}
                          icon={<PlusCircleOutlined />}
                          onClick={loadMoreGames}
                        >
                          Load more matches
                        </Button>
                      )}
                    </div>
                    <div>
                      <BulbOutlined /> Try using filters
                    </div>
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
    <>
      <div>
        <div style={{ float: "left" }}>
          <Tooltip
            title={
              "Only Automatch games are stored. We might filter out some broken games / custom games. If you don't see" +
              " matches you would expect, please reach out to us. Also if you would like feature to be able to keep some matches forever please" +
              " let us know too. Keeping all these matches is increasing the server costs, please consider donating. Thanks!"
            }
          >
            <BulbOutlined /> COH2 Stats keeps only last 14 days of matches.
          </Tooltip>
        </div>
        <div style={{ float: "right" }}>
          <DatabaseOutlined /> Data source <COHStatsIcon />
        </div>
      </div>
      {Content}
    </>
  );
};

export default AllMatchesTable;

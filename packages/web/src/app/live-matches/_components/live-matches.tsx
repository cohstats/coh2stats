"use client";

import React, { useEffect } from "react";
import LiveMatchesCard from "./live-matches-card";
import { Col, Row, Select, Space } from "antd";
import routes from "../../../routes";
import { useRouter } from "next/navigation";
import LiveMatchesTable from "./live-matches-table";
import firebaseAnalytics from "../../../analytics";
import { StatsCurrentLiveGames, LiveGame } from "../../../coh/types";
// import { AlertBox } from "../../../components/alert-box";

// const warningUnavailable = (
//   <AlertBox
//     type={"error"}
//     message={"Live matches are unavailable"}
//     description={
//       "After latest game update, the live matches are not available. We will try to bring them up as soon as possible. Hop into our discord for latest updates and news."
//     }
//   />
// );

interface LiveMatchesProps {
  firestoreData: StatsCurrentLiveGames | null;
  initialLiveGamesData: LiveGame[] | null;
  playerGroup: string;
  orderBy: string;
  start: string;
}

const LiveMatches: React.FC<LiveMatchesProps> = ({
  firestoreData,
  initialLiveGamesData,
  playerGroup,
  orderBy,
  start,
}) => {
  const router = useRouter();

  useEffect(() => {
    firebaseAnalytics.liveMatchesDisplayed();
  }, []);

  const changeRoute = (params: Record<string, string | number | undefined>) => {
    const { playerGroupToLoad } = params;
    let { orderByToLoad, startToLoad } = params;

    if ((playerGroupToLoad === "5" || playerGroupToLoad === "0") && orderBy === "0") {
      orderByToLoad = "1";
    }

    // When we are changing the player group we want to reset the pagination
    if (playerGroupToLoad !== undefined) {
      startToLoad = 0;
    }

    const searchValue = `?${new URLSearchParams({
      playerGroup: (playerGroupToLoad || playerGroup).toString(),
      orderBy: (orderByToLoad || orderBy).toString(),
      // We need special handling for 0 as it's false, lol
      start: (startToLoad === 0 ? 0 : startToLoad || start).toString(),
    })}`;

    router.push(`${routes.liveMatchesBase()}${searchValue}`);
  };

  const onPlayerGroupSelect = (value: string) => {
    changeRoute({ playerGroupToLoad: value });
  };

  return (
    <Row justify="center" style={{ padding: "10px" }}>
      <Col xs={24} xxl={17}>
        <Row justify="center">
          {/*{warningUnavailable}*/}
          <Col span={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <div>
                <Space
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  wrap
                >
                  <h3> Display live games</h3>
                  <Select
                    value={playerGroup}
                    onChange={onPlayerGroupSelect}
                    style={{ width: 160 }}
                    size="large"
                    options={[
                      { value: "1", label: "1v1 Automatch" },
                      { value: "2", label: "2v2 Automatch" },
                      { value: "3", label: "3v3 Automatch" },
                      { value: "4", label: "4v4 Automatch" },
                      { value: "5", label: "Automatch vs AI" },
                      { value: "0", label: "Custom Games" },
                    ]}
                  />
                  <h3> sort by </h3>
                  <Select
                    value={orderBy}
                    onChange={(value) => changeRoute({ orderByToLoad: value })}
                    style={{ width: 120 }}
                    size="large"
                    options={[
                      {
                        value: "0",
                        label: "Rank",
                        disabled: playerGroup === "0" || playerGroup === "5", // Automatch and custom can't be sorted by rank
                      },
                      { value: "1", label: "Start Time" },
                      { value: "2", label: "Viewers" },
                    ]}
                  />
                </Space>
              </div>
              <div style={{ width: "100%", maxWidth: "480px" }}>
                <LiveMatchesCard data={firestoreData} />
              </div>
            </div>
          </Col>
        </Row>
        <Row justify="center" style={{ paddingTop: 10, minHeight: "1500px" }}>
          <Col span={24}>
            <LiveMatchesTable
              changeRoute={changeRoute}
              currentLiveGamesData={firestoreData}
              initialData={initialLiveGamesData}
              playerGroup={playerGroup}
              start={start}
              orderBy={orderBy}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LiveMatches;

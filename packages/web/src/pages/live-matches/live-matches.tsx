import React, { useEffect } from "react";
import LiveMatchesCard from "./live-matches-card";
import { useQuery } from "../../utils/helpers";
import { Col, Row, Select, Space } from "antd";
import routes from "../../routes";
import { useHistory } from "react-router";
import LiveMatchesTable from "./live-matches-table";
import firebaseAnalytics from "../../analytics";

const { Option } = Select;

const LiveMatches: React.FC = () => {
  const { push } = useHistory();
  const query = useQuery();

  const playerGroup = query.get("playerGroup") || "1";
  const startQuery = query.get("start") || 0;
  const orderByQuery = query.get("orderBy") || "0";

  useEffect(() => {
    firebaseAnalytics.liveMatchesDisplayed();
  }, []);

  const changeRoute = (params: Record<string, any>) => {
    let { playerGroupToLoad, orderByToLoad, startToLoad } = params;

    if ((playerGroupToLoad === "5" || playerGroupToLoad === "0") && orderByQuery === "0") {
      orderByToLoad = "1";
    }

    const searchValue = `?${new URLSearchParams({
      playerGroup: playerGroupToLoad || playerGroup,
      orderBy: orderByToLoad || orderByQuery,
      // We need special handling for 0 as it's false, lol
      start: startToLoad === 0 ? 0 : startToLoad || startQuery,
    })}`;

    push({
      pathname: routes.liveMatchesBase(),
      search: searchValue,
    });
  };

  const onPlayerGroupSelect = (value: string) => {
    changeRoute({ playerGroupToLoad: value });
  };

  return (
    <Row justify="center" style={{ padding: "10px" }}>
      <Col xs={24} xxl={17}>
        <Row justify="center">
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
                    size={"large"}
                  >
                    <Option value="1">1v1 Automatch</Option>
                    <Option value="2">2v2 Automatch</Option>
                    <Option value="3">3v3 Automatch</Option>
                    <Option value="4">4v4 Automatch</Option>
                    <Option value="5">Automatch vs AI</Option>
                    <Option value="0">Custom Games</Option>
                  </Select>
                  <h3> sort by </h3>
                  <Select
                    value={orderByQuery}
                    onChange={(value) => changeRoute({ orderByToLoad: value })}
                    style={{ width: 120 }}
                    size={"large"}
                  >
                    <Option
                      value="0"
                      disabled={(() => {
                        // Automatch and custom can't be sorted by rank
                        // eslint-disable-next-line eqeqeq
                        return playerGroup == "0" || playerGroup == "5";
                      })()}
                    >
                      Rank
                    </Option>
                    <Option value="1">Start Time</Option>
                    <Option value="2">Viewers</Option>
                  </Select>
                </Space>
              </div>
              <div style={{ width: "100%", maxWidth: "440px" }}>
                <LiveMatchesCard />
              </div>
            </div>
          </Col>
        </Row>
        <Row justify="center" style={{ paddingTop: 10 }}>
          <Col span={24}>
            <LiveMatchesTable changeRoute={changeRoute} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LiveMatches;

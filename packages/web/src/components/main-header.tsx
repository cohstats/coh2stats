import React from "react";
import { Header } from "antd/lib/layout/layout";
import { Badge, Menu, Space, Tooltip } from "antd";
import routes from "../routes";
import { useRouteMatch } from "react-router";
import { PlayerSearchInput } from "./header-search";
import { aboutBase, bulletinsBase, commanderBase } from "../titles";
import SubMenu from "antd/es/menu/SubMenu";
import { useData, useLoading } from "../firebase";
import { Link } from "react-router-dom";

const pageTitleSwitch = (path: string) => {
  switch (path) {
    case routes.commanderBase():
      document.title = commanderBase;
      break;
    case routes.statsBase():
      // we are setting up this in the stats page component
      break;
    case routes.bulletinsBase():
      document.title = bulletinsBase;
      break;
    case routes.aboutBase():
      document.title = aboutBase;
      break;
  }
};

export const MainHeader: React.FC = () => {
  const isOnlinePlayersLoading = useLoading("onlinePlayers");
  const onlinePlayersData: Record<string, any> = useData("onlinePlayers");

  const commandersMatch = useRouteMatch({
    path: routes.commanderBase(),
  });

  const statsMatch = useRouteMatch({
    path: routes.statsBase(),
  });

  const mapStatsMatch = useRouteMatch({
    path: routes.mapStats(),
  });

  const leaderboardsMatch = useRouteMatch({
    path: routes.leaderboardsBase(),
  });

  const aboutMatch = useRouteMatch({
    path: routes.aboutBase(),
  });

  const bulletinsMatch = useRouteMatch({
    path: routes.bulletinsBase(),
  });

  let pathMatch =
    commandersMatch ||
    statsMatch ||
    aboutMatch ||
    bulletinsMatch ||
    mapStatsMatch ||
    leaderboardsMatch;
  const currentPath = pathMatch?.path || "";
  pageTitleSwitch(currentPath);

  return (
    <Header style={{ height: "auto" }}>
      <div>
        <div style={{ float: "left" }}>
          <Link to={"/"}>
            <div
              style={{
                color: "whitesmoke",
                fontSize: "x-large",
                fontFamily: "sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              CoH 2 Logs & Stats
            </div>
          </Link>
        </div>
        <div
          style={{
            float: "right",
          }}
        >
          <Space
            direction={"horizontal"}
            size={"small"}
            wrap
            style={{ display: "flex", justifyContent: "center" }}
          >
            {/*Add div because of the layout shift*/}
            <div style={{ minHeight: 64, minWidth: 125 }}>
              {!isOnlinePlayersLoading && (
                <Tooltip
                  title={`Amount of online Steam players in game Company of Heroes 2 as of  ${new Date(
                    onlinePlayersData["timeStamp"] * 1000,
                  ).toLocaleString()}`}
                >
                  <span
                    style={{
                      color: "#f0f2f5",
                    }}
                  >
                    Ingame players
                  </span>

                  <Badge
                    className="site-badge-count-109"
                    count={onlinePlayersData["onlinePlayers"]}
                    style={{ backgroundColor: "#52c41a", boxShadow: "0 0 0 0", marginLeft: 10 }}
                    overflowCount={99999}
                  />
                </Tooltip>
              )}
            </div>

            <PlayerSearchInput />
          </Space>
        </div>
        <div>
          <Menu
            overflowedIndicator={<div style={{ fontSize: "x-large" }}>☰</div>}
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentPath]}
            defaultSelectedKeys={[currentPath]}
          >
            <Menu.Item key={routes.playerCardBase()}>
              <Link to={routes.playerCardBase()}>Players</Link>
            </Menu.Item>
            <Menu.Item key={routes.statsBase()}>
              <Link to={routes.statsBase()}>Stats</Link>
            </Menu.Item>
            <Menu.Item key={routes.mapStats()}>
              <Link to={routes.mapStats()}>Map Stats</Link>
            </Menu.Item>
            <Menu.Item key={routes.leaderboardsBase()}>
              <Link to={routes.leaderboardsBase()}>Leaderboards</Link>
            </Menu.Item>
            <Menu.Item key={routes.commanderBase()}>
              <Link to={routes.commanderBase()}>Commanders</Link>
            </Menu.Item>
            <Menu.Item key={routes.bulletinsBase()}>
              <Link to={routes.bulletinsBase()}>Intel Bulletins</Link>
            </Menu.Item>
            <Menu.Item key={routes.desktopAppBase()}>
              <Link to={routes.desktopAppBase()}>Desktop App</Link>
            </Menu.Item>
            <SubMenu key={routes.aboutBase()} title={"About"}>
              <Menu.Item key={`${routes.aboutBase()}#base`}>
                <Link to={routes.aboutBase()}>About</Link>
              </Menu.Item>
              <Menu.Item key={`${routes.aboutBase()}#bugs`}>
                <Link to={`${routes.aboutBase()}#bugs`}>Contribution</Link>
              </Menu.Item>
              <Menu.Item key={`${routes.aboutBase()}#donations`}>
                <Link to={`${routes.aboutBase()}#donations`}>Donation</Link>
              </Menu.Item>
              <Menu.Item key={"relic-api-status"}>
                <a
                  href="https://stats.uptimerobot.com/03lN1ckr5j"
                  target="_blank"
                  rel={"noreferrer"}
                >
                  Relic API Status
                </a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </Header>
  );
};

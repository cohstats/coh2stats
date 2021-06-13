import React, { useEffect } from "react";
import { Header } from "antd/lib/layout/layout";
import { Badge, Menu, Space, Tooltip } from "antd";
import routes from "../routes";
import { useRouteMatch } from "react-router";
import { PlayerSearchInput } from "./header-search";
import { aboutBase, bulletinsBase, commanderBase } from "../titles";
import SubMenu from "antd/es/menu/SubMenu";
import { firebase, useData, useLoading } from "../firebase";
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

  useEffect(() => {
    (async () => {
      try {
        const triggerDBUpdate = firebase
          .functions()
          .httpsCallable("triggerNumberOfOnlinePlayers");
        await triggerDBUpdate();
      } catch (e) {
        // We are just triggering the update we don't care about the
        // error. Btw it can fail in case the function is already running.
      }
    })();
  }, []);

  const commandersMatch = useRouteMatch({
    path: routes.commanderBase(),
  });

  const statsMatch = useRouteMatch({
    path: routes.statsBase(),
  });

  const aboutMatch = useRouteMatch({
    path: routes.aboutBase(),
  });

  const bulletinsMatch = useRouteMatch({
    path: routes.bulletinsBase(),
  });

  let pathMatch = commandersMatch || statsMatch || aboutMatch || bulletinsMatch;
  const currentPath = pathMatch?.path || "";
  pageTitleSwitch(currentPath);

  return (
    <Header style={{ height: "auto" }}>
      <div
        style={{
          position: "relative",
          float: "right",
        }}
      >
        <Space direction={"horizontal"} size={"small"}>
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

          <PlayerSearchInput />
        </Space>
      </div>
      <Space direction={"horizontal"} size={"large"}>
        <Link to={"/"}>
          <div
            style={{
              color: "whitesmoke",
              fontSize: "x-large",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            CoH 2 Logs & Stats
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]}
          defaultSelectedKeys={[currentPath]}
        >
          <Menu.Item key={routes.statsBase()}>
            <Link to={routes.statsBase()}>Stats</Link>
          </Menu.Item>
          <Menu.Item disabled={true} key="8">
            Players
          </Menu.Item>
          <Menu.Item disabled={true} key="9">
            Matches
          </Menu.Item>
          <Menu.Item disabled={true} key="11">
            Leaderboards
          </Menu.Item>
          <Menu.Item key={routes.commanderBase()}>
            <Link to={routes.commanderBase()}>Commanders</Link>
          </Menu.Item>
          <Menu.Item key={routes.bulletinsBase()}>
            <Link to={routes.bulletinsBase()}>Intel Bulletins</Link>
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
          </SubMenu>
        </Menu>
      </Space>
    </Header>
  );
};

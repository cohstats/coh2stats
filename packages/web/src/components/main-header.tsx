import React from "react";
import { Header } from "antd/lib/layout/layout";
import { Menu, Space } from "antd";
import routes from "../routes";
import { useHistory, useRouteMatch } from "react-router";
import { PlayerSearchInput } from "./header-search";
import { aboutBase, bulletinsBase, commanderBase } from "../titles";

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
  const { push } = useHistory();

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

  const onMenuClick = (item: Record<string, any>) => {
    push(item.key);
  };

  const onTitleClick = () => {
    push("");
  };

  return (
    <Header style={{ height: "auto" }}>
      <PlayerSearchInput />
      <Space direction={"horizontal"} size={"large"}>
        <div
          onClick={onTitleClick}
          style={{
            color: "whitesmoke",
            fontSize: "x-large",
            fontFamily: "sans-serif",
            cursor: "pointer",
          }}
        >
          CoH 2 Logs & Stats
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]}
          defaultSelectedKeys={[currentPath]}
        >
          <Menu.Item key={routes.statsBase()} onClick={onMenuClick}>
            Stats
          </Menu.Item>
          <Menu.Item disabled={true} key="8" onClick={onMenuClick}>
            Players
          </Menu.Item>
          <Menu.Item disabled={true} key="9" onClick={onMenuClick}>
            Matches
          </Menu.Item>
          <Menu.Item disabled={true} key="11" onClick={onMenuClick}>
            Leaderboards
          </Menu.Item>
          <Menu.Item key={routes.commanderBase()} onClick={onMenuClick}>
            Commanders
          </Menu.Item>
          <Menu.Item key={routes.bulletinsBase()} onClick={onMenuClick}>
            Intel Bulletins
          </Menu.Item>
          <Menu.Item key={routes.aboutBase()} onClick={onMenuClick}>
            About
          </Menu.Item>
        </Menu>
      </Space>
    </Header>
  );
};

import React from "react";
import { Header } from "antd/lib/layout/layout";
import {Divider, Image, Menu, Space} from "antd";
import routes from "../routes";
import { useHistory, useRouteMatch } from "react-router";

export const MainHeader: React.FC = () => {
  const { push } = useHistory();

  const commandersMatch = useRouteMatch({
    path: routes.commanderBase(),
  });

  const statsMatch = useRouteMatch({
    path: routes.statsBase(),
  });

  let pathMatch = commandersMatch || statsMatch;
  const currentPath = pathMatch?.path || "";

  const onMenuClick = (item: Record<string, any>) => {
    push(item.key);
  };

  return (
    <Header>
      <Space direction={"horizontal"} size={"large"}>
        <div style={{color: "whitesmoke", fontSize: "large", fontFamily: "sans-serif" }}>CoH 2 Logs & Stats</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentPath]}>
          <Menu.Item key={routes.statsBase()} onClick={onMenuClick}>
            Stats
          </Menu.Item>
          <Menu.Item disabled={true} key="8">
            Players
          </Menu.Item>
          <Menu.Item disabled={true} key="9">
            Matches
          </Menu.Item>
          <Menu.Item key={routes.commanderBase()} onClick={onMenuClick}>
            Commanders
          </Menu.Item>
          <Menu.Item key="4">Intel Bulletins</Menu.Item>
          <Menu.Item key="5">About</Menu.Item>
        </Menu>
      </Space>

    </Header>
  );
};

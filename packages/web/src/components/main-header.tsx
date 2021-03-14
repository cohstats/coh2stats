import React from "react";
import { Header } from "antd/lib/layout/layout";
import { Divider, Image, Menu, Space } from "antd";
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

  const aboutMatch = useRouteMatch({
    path: routes.aboutBase(),
  });

  let pathMatch = commandersMatch || statsMatch || aboutMatch;
  const currentPath = pathMatch?.path || "";

  const onMenuClick = (item: Record<string, any>) => {
    push(item.key);
  };

  const onTitleClick = () => {
    push("");
  };

  return (
    <Header>
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
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentPath]}>
          <Menu.Item key={routes.statsBase()} onClick={onMenuClick}>
            Stats
          </Menu.Item>
          <Menu.Item disabled={true} key="8" onClick={onMenuClick}>
            Players
          </Menu.Item>
          <Menu.Item disabled={true} key="9" onClick={onMenuClick}>
            Matches
          </Menu.Item>
          <Menu.Item key={routes.commanderBase()} onClick={onMenuClick}>
            Commanders
          </Menu.Item>
          <Menu.Item key="4">Intel Bulletins</Menu.Item>
          <Menu.Item key={routes.aboutBase()} onClick={onMenuClick}>
            About
          </Menu.Item>
        </Menu>
      </Space>
    </Header>
  );
};

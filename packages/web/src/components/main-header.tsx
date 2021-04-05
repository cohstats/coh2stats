import React from "react";
import { Header } from "antd/lib/layout/layout";
import { Col, Menu, Row, Space } from "antd";
import routes from "../routes";
import { useHistory, useRouteMatch } from "react-router";
import { PlayerSearchInput } from "./header-search";
import { Typography, Switch } from "antd";

export const MainHeader: React.FC = () => {
  function useDeviceDetect() {
    const [isMobile, setMobile] = React.useState(false);

    React.useEffect(() => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i),
      );
      setMobile(mobile);
    }, []);
    return { isMobile };
  }

  const { isMobile } = useDeviceDetect();

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

  const onMenuClick = (item: Record<string, any>) => {
    push(item.key);
  };

  const onTitleClick = () => {
    push("");
  };

  if (isMobile) {
    return (
      <Header style={{ height: "auto" }}>
        <Row>
          <Col span={12}>
            <div
              onClick={onTitleClick}
              style={{
                color: "whitesmoke",
                fontSize: "x-large",
                fontFamily: "sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CoH 2 Logs & Stats
            </div>
          </Col>
          <Col span={12}>
            <PlayerSearchInput />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
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
          </Col>
        </Row>
      </Header>
    );
  } else {
    return (
      <Header style={{ height: "auto" }}>
        <Row>
          <Col span={12}>
            <div
              onClick={onTitleClick}
              style={{
                color: "whitesmoke",
                fontSize: "x-large",
                fontFamily: "sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CoH 2 Logs & Stats
            </div>
          </Col>
          <Col span={12}>
            <PlayerSearchInput />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
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
          </Col>
        </Row>
      </Header>
    );
  }
};

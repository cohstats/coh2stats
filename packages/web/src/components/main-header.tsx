/**
 * This component can also change the title of the pages.
 * Some pages which have dynamic title - such as stats / map stats / player cards handle the title
 * in their components.
 *
 * Other which are static are handled here.
 */
import React from "react";
import { Header } from "antd/es/layout/layout";
import { Menu, Space } from "antd";
import routes from "../routes";
import { useMatch } from "react-router-dom-v5-compat";
import { PlayerSearchInput } from "./header-search";
import {
  aboutBase,
  bulletinsBase,
  commanderBase,
  desktopAppBase,
  liveMatchesAppBase,
  mostRecentGamesAppBase,
  regionsBase,
} from "../titles";
import { Link } from "react-router-dom-v5-compat";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import OnlinePlayers from "./online-players";

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
    case routes.desktopAppBase():
      document.title = desktopAppBase;
      break;
    case routes.liveMatchesBase():
      document.title = liveMatchesAppBase;
      break;
    case routes.recentMatchesBase():
      document.title = mostRecentGamesAppBase;
      break;
    case routes.regionsBase():
      document.title = regionsBase;
  }
};

const menuItems: ItemType[] = [
  { key: routes.playerCardBase(), label: <Link to={routes.playerCardBase()}>Players</Link> },
  { key: routes.statsBase(), label: <Link to={routes.statsBase()}>Stats</Link> },
  { key: routes.mapStats(), label: <Link to={routes.mapStats()}>Map Stats</Link> },
  {
    key: routes.leaderboardsBase(),
    label: <Link to={routes.leaderboardsBase()}>Leaderboards</Link>,
  },
  { key: routes.liveMatchesBase(), label: <Link to={routes.liveMatchesBase()}>Live Games</Link> },
  { key: routes.commanderBase(), label: <Link to={routes.commanderBase()}>Commanders</Link> },
  {
    key: routes.bulletinsBase(),
    label: <Link to={routes.bulletinsBase()}>Intel Bulletins</Link>,
  },
  { key: routes.desktopAppBase(), label: <Link to={routes.desktopAppBase()}>Desktop App</Link> },
  {
    key: routes.recentMatchesBase(),
    label: <Link to={routes.recentMatchesBase()}>Recent Games</Link>,
  },
  {
    label: "Other",
    key: "other",
    children: [
      {
        key: routes.openData(),
        label: <Link to={routes.openData()}>Open Data</Link>,
      },
      {
        key: `${routes.regionsBase()}`,
        label: <Link to={`${routes.regionsBase()}`}>Regions Settings</Link>,
      },
      {
        key: "relic-api-status",
        label: (
          <a href="https://stats.uptimerobot.com/03lN1ckr5j" target="_blank" rel={"noreferrer"}>
            Relic API Status
          </a>
        ),
      },
    ],
  },
  {
    label: "About",
    key: routes.aboutBase(),
    children: [
      { key: `${routes.aboutBase()}#base`, label: <Link to={routes.aboutBase()}>About</Link> },
      {
        key: `${routes.aboutBase()}#bugs`,
        label: <Link to={`${routes.aboutBase()}#bugs`}>Contribution</Link>,
      },
      {
        key: `${routes.aboutBase()}#donations`,
        label: <Link to={`${routes.aboutBase()}#donations`}>Donation</Link>,
      },
    ],
  },
];

export const MainHeader: React.FC = () => {
  /**
   * It would be great if we could re-write this code as it has a lot of hard-coded stuff
   */

  const commandersMatch = useMatch(routes.commanderBase() + "/*");

  const statsMatch = useMatch(routes.statsBase() + "/*");

  const mapStatsMatch = useMatch(routes.mapStats() + "/*");

  const leaderboardsMatch = useMatch(routes.leaderboardsBase() + "/*");

  const regionMatch = useMatch(routes.regionsBase() + "/*");

  const aboutMatch = useMatch(routes.aboutBase() + "/*");

  const bulletinsMatch = useMatch(routes.bulletinsBase() + "/*");

  const desktopAppMatch = useMatch(routes.desktopAppBase() + "/*");

  const liveMatchesMatch = useMatch(routes.liveMatchesBase() + "/*");

  const recentMatches = useMatch(routes.recentMatchesBase() + "/*");

  let pathMatch =
    commandersMatch ||
    statsMatch ||
    // needs to be before about match
    regionMatch ||
    aboutMatch ||
    bulletinsMatch ||
    mapStatsMatch ||
    desktopAppMatch ||
    liveMatchesMatch ||
    recentMatches ||
    leaderboardsMatch;
  const currentPath = pathMatch?.pattern?.path?.replace("/*", "") || "";
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
              COH 2 Stats
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
              <OnlinePlayers />
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
            items={menuItems}
            defaultSelectedKeys={[currentPath]}
          />
        </div>
      </div>
    </Header>
  );
};

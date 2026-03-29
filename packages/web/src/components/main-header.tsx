// @ts-nocheck
/**
 * This component can also change the title of the pages.
 * Some pages which have dynamic title - such as stats / map stats / player cards handle the title
 * in their components.
 *
 * Other which are static are handled here.
 */
"use client";

import React from "react";
import { Layout, Menu, Space, MenuProps } from "antd";
import routes from "../routes";
import { usePathname } from "next/navigation";
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
import Link from "next/link";
import OnlinePlayers from "./online-players";

const { Header } = Layout;

const pageTitleSwitch = (path: string) => {
  if (typeof window === "undefined") return;

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

type ItemType = MenuProps["items"][number];

const menuItems: ItemType[] = [
  { key: routes.playerCardBase(), label: <Link href={routes.playerCardBase()}>Players</Link> },
  { key: routes.statsBase(), label: <Link href={routes.statsBase()}>Stats</Link> },
  { key: routes.mapStats(), label: <Link href={routes.mapStats()}>Map Stats</Link> },
  {
    key: routes.leaderboardsBase(),
    label: <Link href={routes.leaderboardsBase()}>Leaderboards</Link>,
  },
  {
    key: routes.liveMatchesBase(),
    label: <Link href={routes.liveMatchesBase()}>Live Games</Link>,
  },
  { key: routes.commanderBase(), label: <Link href={routes.commanderBase()}>Commanders</Link> },
  {
    key: routes.bulletinsBase(),
    label: <Link href={routes.bulletinsBase()}>Intel Bulletins</Link>,
  },
  {
    key: routes.desktopAppBase(),
    label: <Link href={routes.desktopAppBase()}>Desktop App</Link>,
  },
  {
    key: routes.recentMatchesBase(),
    label: <Link href={routes.recentMatchesBase()}>Recent Games</Link>,
  },
  {
    label: "Other",
    key: "other",
    children: [
      {
        key: routes.openData(),
        label: <Link href={routes.openData()}>Open Data</Link>,
      },
      {
        key: `${routes.regionsBase()}`,
        label: <Link href={`${routes.regionsBase()}`}>Regions Settings</Link>,
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
      { key: `${routes.aboutBase()}#base`, label: <Link href={routes.aboutBase()}>About</Link> },
      {
        key: `${routes.aboutBase()}#bugs`,
        label: <Link href={`${routes.aboutBase()}#bugs`}>Contribution</Link>,
      },
      {
        key: `${routes.aboutBase()}#donations`,
        label: <Link href={`${routes.aboutBase()}#donations`}>Donation</Link>,
      },
    ],
  },
];

export const MainHeader: React.FC = () => {
  /**
   * It would be great if we could re-write this code as it has a lot of hard-coded stuff
   */

  const pathname = usePathname();

  // Helper function to check if pathname matches a route
  const matchesRoute = (route: string): boolean => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + "/")) return true;
    return false;
  };

  // Determine current path for menu selection
  let currentPath = "";
  if (matchesRoute(routes.commanderBase())) currentPath = routes.commanderBase();
  else if (matchesRoute(routes.statsBase())) currentPath = routes.statsBase();
  else if (matchesRoute(routes.regionsBase())) currentPath = routes.regionsBase();
  else if (matchesRoute(routes.aboutBase())) currentPath = routes.aboutBase();
  else if (matchesRoute(routes.bulletinsBase())) currentPath = routes.bulletinsBase();
  else if (matchesRoute(routes.mapStats())) currentPath = routes.mapStats();
  else if (matchesRoute(routes.desktopAppBase())) currentPath = routes.desktopAppBase();
  else if (matchesRoute(routes.liveMatchesBase())) currentPath = routes.liveMatchesBase();
  else if (matchesRoute(routes.recentMatchesBase())) currentPath = routes.recentMatchesBase();
  else if (matchesRoute(routes.leaderboardsBase())) currentPath = routes.leaderboardsBase();
  else if (matchesRoute(routes.playerCardBase())) currentPath = routes.playerCardBase();

  pageTitleSwitch(currentPath);

  return (
    <Header style={{ height: "auto" }}>
      <div>
        <div style={{ float: "left" }}>
          <Link href={"/"}>
            <div
              style={{
                color: "whitesmoke",
                fontSize: "x-large",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              COH2 Stats
            </div>
          </Link>
        </div>
        <div
          style={{
            float: "right",
          }}
        >
          <Space
            orientation={"horizontal"}
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

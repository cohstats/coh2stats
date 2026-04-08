"use client";

import React from "react";
import { Layout, Menu, Space, MenuProps } from "antd";
import routes from "../routes";
import { usePathname } from "next/navigation";
import { PlayerSearchInput } from "./header-search";
import Link from "next/link";
import Image from "next/image";
import OnlinePlayers from "./online-players";
import config from "../config";
import kofiLogo from "../../public/resources/kofi_s_logo_nolabel.webp";

const { Header } = Layout;

// @ts-ignore
type ItemType = MenuProps["items"][number];

const menuItems: ItemType[] = [
  { key: routes.playerCardBase(), label: <Link href={routes.playerCardBase()} prefetch={false}>Players</Link> },
  { key: routes.statsBase(), label: <Link href={routes.statsBase()} prefetch={false}>Stats</Link> },
  { key: routes.mapStats(), label: <Link href={routes.mapStats()} prefetch={false}>Map Stats</Link> },
  {
    key: routes.leaderboardsBase(),
    label: <Link href={routes.leaderboardsBase()} prefetch={false}>Leaderboards</Link>,
  },
  {
    key: routes.liveMatchesBase(),
    label: <Link href={routes.liveMatchesBase()} prefetch={false}>Live Games</Link>,
  },
  { key: routes.commanderBase(), label: <Link href={routes.commanderBase()} prefetch={false}>Commanders</Link> },
  {
    key: routes.bulletinsBase(),
    label: <Link href={routes.bulletinsBase()} prefetch={false}>Intel Bulletins</Link>,
  },
  {
    key: routes.desktopAppBase(),
    label: <Link href={routes.desktopAppBase()} prefetch={false}>Desktop App</Link>,
  },
  {
    key: routes.recentMatchesBase(),
    label: <Link href={routes.recentMatchesBase()} prefetch={false}>Recent Games</Link>,
  },
  {
    label: "Other",
    key: "other",
    children: [
      {
        key: routes.openData(),
        label: <Link href={routes.openData()} prefetch={false}>Open Data</Link>,
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
      { key: `${routes.aboutBase()}#base`, label: <Link href={routes.aboutBase()} prefetch={false}>About</Link> },
      {
        key: `${routes.aboutBase()}#bugs`,
        label: <Link href={`${routes.aboutBase()}#bugs`} prefetch={false}>Contribution</Link>,
      },
      {
        key: `${routes.aboutBase()}#donations`,
        label: <Link href={`${routes.aboutBase()}#donations`} prefetch={false}>Donation</Link>,
      },
    ],
  },
  {
    key: "support-us",
    label: (
      <a href={config.donationLink} target="_blank" rel="noreferrer">
        <Image
          width={24}
          height={24}
          src={kofiLogo}
          alt={"Ko-fi support button"}
          style={{ marginRight: 4, verticalAlign: "middle" }}
        />
        Support Us
      </a>
    ),
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
  else if (matchesRoute(routes.aboutBase())) currentPath = routes.aboutBase();
  else if (matchesRoute(routes.bulletinsBase())) currentPath = routes.bulletinsBase();
  else if (matchesRoute(routes.mapStats())) currentPath = routes.mapStats();
  else if (matchesRoute(routes.desktopAppBase())) currentPath = routes.desktopAppBase();
  else if (matchesRoute(routes.liveMatchesBase())) currentPath = routes.liveMatchesBase();
  else if (matchesRoute(routes.recentMatchesBase())) currentPath = routes.recentMatchesBase();
  else if (matchesRoute(routes.leaderboardsBase())) currentPath = routes.leaderboardsBase();
  else if (matchesRoute(routes.playerCardBase())) currentPath = routes.playerCardBase();

  return (
    <Header style={{ height: "auto" }}>
      <div>
        <div style={{ float: "left" }}>
          <Link href={"/"} prefetch={false}>
            <div
              style={{
                color: "whitesmoke",
                fontSize: "x-large",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
                paddingRight: 10,
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

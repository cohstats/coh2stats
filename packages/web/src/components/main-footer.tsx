// @ts-nocheck
"use client";

import React from "react";
import { Layout, Divider, Typography } from "antd";
import NextLink from "next/link";
import config from "../config";

const { Footer } = Layout;
const { Link, Text } = Typography;

export const MainFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center", padding: 0, paddingBottom: 10, marginTop: 20 }}>
      <Divider style={{ marginTop: 0 }} />
      This is unofficial fan-made site for Company Of Heroes 2. Not associated with Relic
      Entertainment.
      <br />
      The data display here are not accurate and do not represent the actual state of the game.
      <br />
      See <NextLink href={"/about"}>about page</NextLink> for more info.
      <br />
      © 2021 - 2026 COH2stats.com
      <br />
      <Link
        href={"https://github.com/cohstats/coh2stats"}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 15 }}
      >
        <img width={30} height={30} src={"/resources/github-dark.png"} alt={"GitHub Logo"} />
      </Link>
      <Link
        href={config.discordInviteLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 15 }}
      >
        <img width={30} height={30} src={"/resources/discord-icon.svg"} alt={"Discord Logo"} />
      </Link>
      <Link href={config.donationLink} target="_blank" rel="noopener noreferrer" strong>
        <img
          width={30}
          height={30}
          src={"/resources/kofi_s_logo_nolabel.webp"}
          alt={"Ko-fi support button"}
        />
        Donate
      </Link>
      <br />
      <br />
      <Text type="secondary" style={{ fontSize: "12px" }}>
        The Company of Heroes is registered trademark of SEGA Holdings. Co
        <br />
        The COH2 Images and other assets are owned by Relic Entertainment and/or SEGA
      </Text>
      <br />
      <br />
      Visit{" "}
      <Link href={"https://coh3stats.com"} target="_blank" rel="noopener noreferrer">
        coh3stats.com
      </Link>{" "}
      for Company of Heroes 3 stats and analytics
    </Footer>
  );
};

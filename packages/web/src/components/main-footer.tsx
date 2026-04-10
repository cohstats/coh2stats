"use client";

import React from "react";
import { Layout, Divider, Typography } from "antd";
import NextLink from "next/link";
import Image from "next/image";
import config from "../config";
import { githubIcon, discordIcon, kofiLogo } from "../coh/commonIconImports";

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
      See <NextLink href={"/about"} prefetch={false}>about page</NextLink> for more info.
      <br />
      © 2021 - 2026 COH2stats.com
      <br />
      <Link
        href={"https://github.com/cohstats/coh2stats"}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 15 }}
      >
        <Image src={githubIcon} width={30} height={30} alt="GitHub Logo" />
      </Link>
      <Link
        href={config.discordInviteLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 15 }}
      >
        <Image src={discordIcon} width={30} height={30} alt="Discord Logo" />
      </Link>
      <Link href={config.donationLink} target="_blank" rel="noopener noreferrer" strong>
        <Image
          src={kofiLogo}
          width={30}
          height={30}
          alt="Ko-fi support button"
          style={{ marginRight: 2 }}
        />
        <span style={{ verticalAlign: "top" }}>Donate</span>
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

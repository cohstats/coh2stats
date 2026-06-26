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
    <Footer style={{ padding: "20px 20px", marginTop: 20 }}>
      <Divider style={{ marginTop: 0 }} />

      {/* Container with max width */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top section: Left text + Right buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          {/* Left side - Copyright and unofficial text */}
          <div style={{ textAlign: "left", maxWidth: "60%" }}>
            <div>© 2021 - 2026 COH2stats.com</div>
            <div>This is an unofficial fan-made site for Company Of Heroes 2.</div>
          </div>

          {/* Right side - Social buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href={config.discordInviteLink} target="_blank" rel="noopener noreferrer">
              <Image src={discordIcon} width={30} height={30} alt="Discord Logo" />
            </Link>
            <Link
              href={"https://github.com/cohstats/coh2stats"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={githubIcon} width={30} height={30} alt="GitHub Logo" />
            </Link>
            <Link href={config.donationLink} target="_blank" rel="noopener noreferrer">
              <Image src={kofiLogo} width={30} height={30} alt="Ko-fi support button" />
            </Link>
          </div>
        </div>

        {/* Bottom section - Centered trademark and links */}
        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            The Company of Heroes is a registered trademark of Relic Entertainment.
            <br />
            The COH Images and other assets are owned by Relic Entertainment.
          </Text>
          <br />
          <br />
          <div>
            Visit{" "}
            <Link href={"https://coh3stats.com"} target="_blank" rel="noopener noreferrer">
              coh3stats.com
            </Link>{" "}
            for Company of Heroes 3 stats and analytics
          </div>
        </div>
      </div>
    </Footer>
  );
};

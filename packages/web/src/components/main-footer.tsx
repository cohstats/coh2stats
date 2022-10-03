import React from "react";
import { Footer } from "antd/es/layout/layout";
import { Divider, Typography } from "antd";
import { Link as RouterLink } from "react-router-dom";
import config from "../config";

const { Link } = Typography;

export const MainFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center", padding: 20 }}>
      <Divider />
      This is unofficial fan-made site for Company Of Heroes 2. Not associated with Relic
      Entertainment.
      <br />
      The data display here are not accurate and do not represent the actual state of the game.
      <br />
      See <RouterLink to={"/about"}>about page</RouterLink> for more info.
      <br />
      © 2022 COH2stats.com
      <br />
      <a href={"https://github.com/cohstats/coh2stats"} target="_blank" rel="noopener noreferrer">
        <img width={30} height={30} src={"/resources/github-dark.png"} alt={"GitHub Logo"} />
      </a>
      {"  "}
      <a href={config.discordInviteLink} target="_blank" rel="noopener noreferrer">
        <img width={30} height={30} src={"/resources/discord-icon.svg"} alt={"Discord Logo"} />
      </a>
      {"  "}
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
      The Company of Heroes is registered trademark of SEGA Holdings. Co
      <br />
      The COH2 Images and other assets are owned by Relic Entertainment and/or SEGA
    </Footer>
  );
};

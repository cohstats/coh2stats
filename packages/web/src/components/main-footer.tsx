import React from "react";
import { Footer } from "antd/lib/layout/layout";
import { Divider } from "antd";

export const MainFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      <Divider />
      This is unofficial fan-made site for COH2. Not associated with Relic Entertainment.
      <br />
      The data display here are not accurate and do not represent the actual state of the game.
      <br />
      See <a href={"/about"}>about page</a> for more info.
      <br />
      © 2021 COH2stats.com
      <br />
      <a
        href={"https://github.com/petrvecera/coh2ladders"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img width={30} height={30} src={"/resources/github-dark.png"} alt={"GitHub Logo"} />
      </a>
      <br />
      <br />
      The Company of Heroes is registered trademark of SEGA Holdings. Co
      <br />
      The COH2 Images and other assets are owned by Relic Entertainment and/or SEGA
    </Footer>
  );
};

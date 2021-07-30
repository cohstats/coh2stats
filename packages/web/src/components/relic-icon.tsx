import React from "react";
import { Tooltip } from "antd";
import { getGeneralIconPath } from "../coh/helpers";

export const RelicIcon: React.FC = () => {
  return (
    <Tooltip title={"Relic"}>
      <img
        style={{ backgroundColor: "#011529" }}
        src={getGeneralIconPath("relic_icon")}
        height="20px"
        alt={"Relic Icon"}
      />
    </Tooltip>
  );
};

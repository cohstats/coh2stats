import React from "react";
import { Tooltip } from "antd";

export const COHStatsIcon: React.FC = () => {
  return (
    <Tooltip title={"coh2stats.com"}>
      <img
        // style={{ backgroundColor: "#011529" }}
        src={"/logo/favicon-32x32.png"}
        height="20px"
        alt={"Relic Icon"}
      />
    </Tooltip>
  );
};

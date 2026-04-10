import React from "react";
import { Tooltip } from "antd";
import Image from "next/image";
import { faviconIcon } from "../coh/commonIconImports";

export const COHStatsIcon: React.FC = () => {
  return (
    <Tooltip title={"coh2stats.com"}>
      <Image
        src={faviconIcon}
        height={20}
        width={20}
        alt="COH2 Icon"
      />
    </Tooltip>
  );
};

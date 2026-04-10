import React from "react";
import { Tooltip } from "antd";
import Image from "next/image";
import { relicIcon } from "../coh/generalIconImports";

export const RelicIcon: React.FC = () => {
  return (
    <Tooltip title={"Relic"}>
      <Image
        src={relicIcon}
        height={20}
        width={20}
        alt="Relic Icon"
        style={{ backgroundColor: "#011529" }}
      />
    </Tooltip>
  );
};

"use client";

import { Input } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import routes from "../routes";

const { Search } = Input;

export const PlayerSearchInput: React.FC = () => {
  const router = useRouter();

  const onSearch = async (value: string) => {
    router.push(routes.searchWithParam(value));
  };

  return (
    <Search
      placeholder="Players, Commanders, Bulletins"
      onSearch={onSearch}
      style={{ width: "100%", verticalAlign: "middle", paddingLeft: 15 }}
      enterButton
    />
  );
};

import Search from "antd/es/input/Search";
import React from "react";
import routes from "../routes";

export const PlayerSearchInput: React.FC = () => {
  const onSearch = async (value: string) => {
    // This is dirty thing, I don't like it at all ... would be nice to have better solution
    window.location.href = routes.searchWithParam(value);
  };

  return (
    <div
      style={{
        position: "relative",
        float: "right",
      }}
    >
      <Search
        placeholder="Player name"
        onSearch={onSearch}
        style={{ width: "100%", verticalAlign: "middle" }}
        enterButton
      />
    </div>
  );
};

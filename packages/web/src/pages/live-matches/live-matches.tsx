import React from "react";
import LiveMatchesCard from "./live-matches-card";

const LiveMatches: React.FC = () => {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <LiveMatchesCard />
    </div>
  );
};

export default LiveMatches;

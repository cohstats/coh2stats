import React from "react";

export const BetaVersion: React.FC = () => {
  return (
    <a href="/about#future" style={{ color: "#fff" }}>
      <div
        style={{
          position: "fixed",
          width: "110px",
          height: "28px",
          background: "#EE8E4A",
          top: "10px",
          left: "-28px",
          textAlign: "center",
          fontSize: "15px",
          fontFamily: "sans-serif",
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "#fff",
          lineHeight: "28px",
          transform: "rotate(-45deg)",
        }}
      >
        BETA
      </div>
    </a>
  );
};

import React from "react";

import "./kofi-donate.css";

export const KoFiDonate: React.FC = () => {
  return (
    <div className={"btn-container"}>
      <a
        title="Support COHStats on ko-fi.com"
        className="kofi-button"
        style={{ backgroundColor: "#74c6f8" }}
        href="https://ko-fi.com/cohstats"
        target="_blank"
        rel={"noreferrer"}
      >
        {" "}
        <span className="kofitext">
          <img
            src="https://storage.ko-fi.com/cdn/cup-border.png"
            alt="Ko-fi donations"
            className="kofiimg"
          />
          Donate
        </span>
      </a>
    </div>
  );
};

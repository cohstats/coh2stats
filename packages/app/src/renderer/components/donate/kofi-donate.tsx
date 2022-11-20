import React from "react";

import "./kofi-donate.css";
import Link from "antd/es/typography/Link";

export const KofiDonate: React.FC = () => {
  return (
    <div className={"btn-container"}>
      <Link
        onClick={() => window.electron.ipcRenderer.openInBrowser("https://ko-fi.com/cohstats")}
      >
        <p className="kofi-button" style={{ backgroundColor: "#74c6f8" }}>
          {" "}
          <span className="kofitext">
            <img
              src="https://storage.ko-fi.com/cdn/cup-border.png"
              alt="Ko-fi donations"
              className="kofiimg"
            />
            Donate
          </span>
        </p>
      </Link>
    </div>
  );
};

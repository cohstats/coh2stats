import React from "react";

import styles from "./kofi-donate.module.css";

export const KofiDonate: React.FC = () => {
  return (
    <div className={styles["btn-container"]}>
      <a
        title="Support COHStats on ko-fi.com"
        className={styles["kofi-button"]}
        style={{ backgroundColor: "#74c6f8" }}
        href="https://ko-fi.com/cohstats"
        target="_blank"
        rel={"noreferrer"}
      >
        {" "}
        <span className={styles.kofitext}>
          <img
            src="https://storage.ko-fi.com/cdn/cup-border.png"
            alt="Ko-fi donations"
            className={styles.kofiimg}
          />
          Donate
        </span>
      </a>
    </div>
  );
};

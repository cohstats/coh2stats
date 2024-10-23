import React from "react";
import { AlertBox } from "./alert-box";
import { Link } from "react-router-dom";
import routes from "../routes";

export const AlertBoxChina: React.FC = () => {
  return (
    <AlertBox
      type={"warning"}
      message={"China/Russia user?"}
      description={
        <>
          If you have problems all over the site. Head over to{" "}
          <Link to={routes.regionsBase()}>Regions page</Link> to learn more
        </>
      }
    />
  );
};

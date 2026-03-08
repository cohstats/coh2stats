"use client";

import React from "react";
import { AlertBox } from "./alert-box";
import Link from "next/link";
import routes from "../routes";

export const AlertBoxChina: React.FC = () => {
  return (
    <AlertBox
      type={"warning"}
      message={"China/Russia user?"}
      description={
        <>
          If you have problems all over the site. Head over to{" "}
          <Link href={routes.regionsBase()}>Regions page</Link> to learn more
        </>
      }
    />
  );
};

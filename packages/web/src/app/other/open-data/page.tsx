import React from "react";
import { OpenDataContent } from "./_components/open-data-content";

// Revalidate every 24 hours (ISR)
export const revalidate = 86400;

export default function OpenData() {
  return <OpenDataContent />;
}

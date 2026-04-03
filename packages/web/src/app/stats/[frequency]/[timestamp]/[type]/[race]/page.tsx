"use client";

import { Suspense } from "react";
import OldStats from "../../../../_components/old-stats";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const OldStatsRedirectPage = () => {
  return (
    <Suspense fallback={null}>
      <OldStats />
    </Suspense>
  );
};

export default OldStatsRedirectPage;

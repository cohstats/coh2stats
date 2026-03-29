// @ts-nocheck
"use client";

import React, { useEffect, Suspense } from "react";
import { ConfigProvider } from "antd";
import { ConfigsProvider } from "../config-context";
import { usePathname, useSearchParams } from "next/navigation";
import analytics from "../analytics";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    if (typeof window !== "undefined" && pathname) {
      analytics.pageView({
        pathname,
        search: searchParams?.toString() ? `?${searchParams.toString()}` : "",
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Firebase is now initialized at module level in firebase.ts
  // No need to initialize here anymore

  return (
    <ConfigsProvider configJson={{}}>
      <ConfigProvider>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </ConfigProvider>
    </ConfigsProvider>
  );
}

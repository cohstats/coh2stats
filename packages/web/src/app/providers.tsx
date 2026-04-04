// @ts-nocheck
"use client";

import React, { useEffect, Suspense } from "react";
import { ConfigProvider } from "antd";
import { ConfigsProvider } from "../config-context";
import { usePathname, useSearchParams } from "next/navigation";
import analytics from "../analytics";
import { ProgressProvider } from "@bprogress/next/app";

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
        <ProgressProvider
          height="4px"
          // antd blue
          color="#1577FF"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
        </ProgressProvider>
      </ConfigProvider>
    </ConfigsProvider>
  );
}

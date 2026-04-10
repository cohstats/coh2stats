"use client";

import React, { useEffect, Suspense, ReactNode } from "react";
import { ConfigProvider, theme } from "antd";
import { ConfigsProvider } from "../config-context";
import { usePathname, useSearchParams } from "next/navigation";
import analytics from "../analytics";
// @ts-ignore
import { ProgressProvider } from "@bprogress/next/app";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      storageKey="coh2UserConfig-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}

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

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useTheme();

  const themeConfig = {
    algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Firebase is now initialized at module level in firebase.ts
  // No need to initialize here anymore

  return (
    <ConfigsProvider configJson={{}}>
      <ThemeProvider>
        <AntdConfigProvider>
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
        </AntdConfigProvider>
      </ThemeProvider>
    </ConfigsProvider>
  );
}

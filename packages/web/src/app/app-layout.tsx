// @ts-nocheck
"use client";

import React from "react";
import { Layout } from "antd";
import { MainHeader } from "../components/main-header";
import { MainFooter } from "../components/main-footer";
import { ErrorBoundary } from "../components/error-boundary";

const { Content } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="App">
      <Layout className="layout">
        <MainHeader />
        <Content>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Content>
        <MainFooter />
      </Layout>
    </div>
  );
}

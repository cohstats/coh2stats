"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder to avoid layout shift
    return (
      <Button
        type="text"
        shape="circle"
        icon={<MoonOutlined />}
        style={{ visibility: "hidden" }}
      />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const tooltipText = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip title={tooltipText}>
      <Button
        type="text"
        shape="circle"
        icon={isDark ? <SunOutlined /> : <MoonOutlined style={{ color: "#fff" }} />}
        onClick={toggleTheme}
        aria-label={tooltipText}
      />
    </Tooltip>
  );
};

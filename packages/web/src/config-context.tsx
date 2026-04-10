"use client";

import React, { createContext, useState, FC } from "react";

type userConfigType = {
  // @deprecated - Region selection has been removed, this property is no longer used
  api?: "gcp" | "cf";
};

const localStorageKey = "coh2UserConfig";

const ConfigContext = createContext<{
  userConfig: userConfigType;
  updateUserConfig: (newConfig: Record<string, string>) => void;
}>({
  updateUserConfig: () => {
    // Default implementation does nothing - will be overridden by provider
  },
  userConfig: { api: "gcp" },
});

const getLocalStorageConfig = () => {
  // Check if we're in the browser before accessing localStorage
  if (typeof window === "undefined") {
    return { api: "gcp" };
  }
  try {
    return JSON.parse(localStorage.getItem(localStorageKey) || "");
  } catch (e) {
    return { api: "gcp" };
  }
};

const setLocalStorageConfig = (config: any) => {
  // Check if we're in the browser before accessing localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, JSON.stringify(config));
  }
};

const ConfigsProvider: FC<any> = (props) => {
  const [userConfig, setUserConfig] = useState<any>(getLocalStorageConfig());

  const updateUserConfig = (newConfig: any) => {
    const mergedConfig = { ...userConfig, ...newConfig };
    setUserConfig(mergedConfig);
    setLocalStorageConfig(mergedConfig);
  };

  return (
    <ConfigContext.Provider value={{ userConfig, updateUserConfig }}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export { ConfigsProvider, ConfigContext };

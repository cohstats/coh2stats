import React, { createContext, useState, FC } from "react";

type userConfigType = {
  api: "gcp" | "cf";
};

const localStorageKey = "coh2UserConfig";

const ConfigContext = createContext<{
  userConfig: userConfigType;
  updateUserConfig: (newConfig: Record<string, string>) => void;
}>({
  updateUserConfig(newConfig: any): void {},
  userConfig: { api: "gcp" },
});

const getLocalStorageConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey) || "");
  } catch (e) {
    return { api: "gcp" };
  }
};

const setLocalStorageConfig = (config: any) => {
  localStorage.setItem(localStorageKey, JSON.stringify(config));
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
export type { userConfigType };

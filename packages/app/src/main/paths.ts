import { isPackaged } from "electron-is-packaged";
import path from "path";

// paths to files are different in dev and packaged version

export const getAssetsPath = (): string => {
  if (isPackaged) {
    return path.resolve("resources/assets");
  }
  return path.resolve("assets");
};

export const getAntdDistPath = (): string => {
  if (isPackaged) {
    return path.resolve("resources/node_modules/antd/dist");
  }
  return path.resolve("node_modules/antd/dist");
};

export const getIconPath = (): string => {
  return path.join(getAssetsPath(), "appIcon.ico");
};

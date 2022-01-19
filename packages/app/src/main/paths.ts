import { isPackaged } from "electron-is-packaged";
import path from "path";

export const getAssetsPath = (): string => {
  if (isPackaged) {
    return path.resolve("resources/assets");
  }
  return path.resolve("assets");
};

export const getIconPath = (): string => {
  return path.join(getAssetsPath(), "icon.ico");
};

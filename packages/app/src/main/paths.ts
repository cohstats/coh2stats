import { isPackaged } from "electron-is-packaged";
import path from "path";

export const getAssetsPath = () => {
    if (isPackaged) {
        return path.resolve("resources/assets");
    }
    return path.resolve("assets");
}

export const getIconPath = () => {
    return path.join(getAssetsPath(), "icon.ico");
}
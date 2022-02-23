import { contextBridge, ipcRenderer, shell } from "electron";
import { configureRendererStore } from "../../redux/configureStoreRenderer";

import { Titlebar } from "custom-electron-titlebar";

const store = configureRendererStore();

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implemenation
  new Titlebar();
});

contextBridge.exposeInMainWorld("electron", {
  store: store,
  ipcRenderer: {
    showProfile(steamID: string) {
      ipcRenderer.send("showProfile", steamID);
    },
    showAbout() {
      ipcRenderer.send("showAbout");
    },
    reloadAllWindows() {
      ipcRenderer.send("reloadAllWindows");
    },
    openInBrowser(link: string) {
      shell.openExternal(link);
    },
    locateLogFile() {
      ipcRenderer.send("locateLogFile");
    },
    scanForLogFile() {
      ipcRenderer.send("scanForLogFile");
    },
  },
});

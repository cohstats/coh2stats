import { contextBridge, ipcRenderer, shell } from "electron";
import { configureRendererStore } from "../../redux/configureStoreRenderer";

const store = configureRendererStore();

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

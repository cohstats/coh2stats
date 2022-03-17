import { contextBridge, ipcRenderer, shell } from "electron";
import { ApplicationWindows } from "../../redux/state";
import { configureRendererStore } from "../../redux/configureStoreRenderer";

const store = configureRendererStore();

contextBridge.exposeInMainWorld("electron", {
  store: store,
  ipcRenderer: {
    showProfile(steamID: string) {
      ipcRenderer.send("showProfile", steamID);
    },
    showWindow(windowName: ApplicationWindows) {
      ipcRenderer.send("showWindow", windowName);
    },
    minimizeWindow(windowName: ApplicationWindows) {
      ipcRenderer.send("minimizeWindow", windowName);
    },
    maximizeWindow(windowName: ApplicationWindows) {
      ipcRenderer.send("maximizeWindow", windowName);
    },
    closeWindow(windowName: ApplicationWindows) {
      ipcRenderer.send("closeWindow", windowName);
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
    configureTwitchExtensionBackend(password: string) {
      ipcRenderer.send("configureTwitchExtensionBackend", password);
    },
    resetTwitchExtensionBackendConfig() {
      ipcRenderer.send("resetTwitchExtensionBackendConfig");
    },
  },
});

import { EnhancedStore } from "@reduxjs/toolkit";
import { ApplicationWindows } from "../../redux/state";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        showProfile(steamID: string): void;
        showWindow(windowName: ApplicationWindows): void;
        minimizeWindow(windowName: ApplicationWindows): void;
        maximizeWindow(windowName: ApplicationWindows): void;
        closeWindow(windowName: ApplicationWindows): void;
        reloadAllWindows(): void;
        openInBrowser(link: string): void;
        locateLogFile(): void;
        scanForLogFile(): void;
      };
      store: EnhancedStore;
    };
  }
}

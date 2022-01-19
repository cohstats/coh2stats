import { contextBridge, ipcRenderer } from "electron";
import { actions } from "../../redux/slice";
import { configureRendererStore } from "../../redux/configureStoreRenderer";

const store = configureRendererStore();

ipcRenderer.on("updateStore", (event, args) => {
  store.dispatch(actions.setStore(args));
});

contextBridge.exposeInMainWorld('electron', {
  store: store,
  ipcRenderer: {
    syncStores() {
      ipcRenderer.send('syncStores');
    },
    showProfile(steamID: string) {
      ipcRenderer.send('showProfile', steamID);
    },
    locateLogFile() {
      ipcRenderer.send('locateLogFile');
    },
    scanForLogFile() {
      ipcRenderer.send('scanForLogFile');
    }
  }
});

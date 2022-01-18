import { contextBridge, ipcRenderer } from "electron";
import { configureRendererStore } from "../../redux/configureStoreRenderer";

contextBridge.exposeInMainWorld('electron', {
  store: configureRendererStore(),
  ipcRenderer: {
    syncStores() {
      ipcRenderer.send('syncStores');
    },
    showProfile(steamID: string) {
      ipcRenderer.send('showProfile', steamID);
    },
/*    on(channel: any, func: any) {
      const validChannels = ['test'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel: any, func: any) {
      const validChannels = ['test'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    }, */
  }
});

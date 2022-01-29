import ElectronStore from "electron-store";
import { ApplicationSettings, ApplicationState } from "../redux/state";
import { defaultSettings, ReduxStore, startupGameData } from "../redux/slice";
import { configureMainStore } from "../redux/configureStoreMain";
import { AnyAction, Unsubscribe } from "@reduxjs/toolkit";
import { ipcMain } from "electron";

export class ApplicationStore {
  runtimeStore: ReduxStore;
  protected fileStore: ElectronStore;
  protected unsubscriber: Unsubscribe;

  constructor() {
    const electronStoreSchema = {
      settings: {
        default: defaultSettings,
      },
    };
    this.fileStore = new ElectronStore<Record<string, unknown>>({
      schema: electronStoreSchema,
    });
    //temporary reset during development
    //this.fileStore.clear();
    //this.setSavedSettings(defaultSettings);
  }

  initializeRuntimeStore(): void {
    const savedSettings = this.fileStore.get("settings") as ApplicationSettings;
    // initialize runtime state
    const startupRuntimeState: ApplicationState = {
      settings: defaultSettings,
      game: startupGameData,
      updateCounter: 0,
    };
    if (savedSettings) {
      startupRuntimeState.settings = savedSettings;
    }
    this.runtimeStore = configureMainStore(startupRuntimeState);
    this.unsubscriber = this.runtimeStore.subscribe(this.runtimeStoreSubscriber);

    // Used to sync redux stores on renderers with the main store when they get created
    ipcMain.on("syncStores", this.storeSyncer);
  }

  getSavedSettings(): ApplicationSettings {
    return this.fileStore.get("settings") as ApplicationSettings;
  }

  getState(): ApplicationState {
    return this.runtimeStore.getState();
  }

  dispatch(action: AnyAction): void {
    this.runtimeStore.dispatch(action);
  }

  protected setSavedSettings(settings: ApplicationSettings): void {
    this.fileStore.set("settings", settings);
  }

  protected storeSyncer = (event: Electron.IpcMainEvent): void => {
    event.sender.send("updateStore", this.runtimeStore.getState());
  };

  protected runtimeStoreSubscriber = (): void => {
    // update file store on changes
    this.setSavedSettings(this.runtimeStore.getState().settings);
  };

  destroy(): void {
    ipcMain.removeListener("syncStores", this.storeSyncer);
    this.unsubscriber();
  }
}

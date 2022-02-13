import ElectronStore from "electron-store";
import { ApplicationSettings, ApplicationState, WindowStates } from "../redux/state";
import { actions, ReduxStore } from "../redux/slice";
import { configureMainStore } from "../redux/configureStoreMain";
import { AnyAction, Unsubscribe } from "@reduxjs/toolkit";
import { app, ipcMain } from "electron";
import { defaultSettings, defaultWindowStates, startupGameData } from "../redux/defaultState";

export class ApplicationStore {
  runtimeStore: ReduxStore;
  protected fileStore: ElectronStore;
  protected unsubscriber: Unsubscribe;

  constructor() {
    const electronStoreSchema = {
      settings: {
        default: defaultSettings,
      },
      windowStates: {
        default: defaultWindowStates,
      },
    };
    this.fileStore = new ElectronStore<Record<string, unknown>>({
      schema: electronStoreSchema,
    });
    //temporary reset during development
    //this.fileStore.clear();
    //this.setSavedSettings(defaultSettings);
    //this.setSavedWindowStates(defaultWindowStates);
  }

  initializeRuntimeStore(): void {
    const savedSettings = this.fileStore.get("settings") as ApplicationSettings;
    const savedWindowStates = this.fileStore.get("windowStates") as WindowStates;
    // initialize runtime state
    const startupRuntimeState: ApplicationState = {
      settings: defaultSettings,
      windowStates: defaultWindowStates,
      game: startupGameData,
      updateCounter: 0,
    };
    if (savedSettings) {
      startupRuntimeState.settings = savedSettings;
    }
    if (savedWindowStates) {
      startupRuntimeState.windowStates = savedWindowStates;
    }
    this.runtimeStore = configureMainStore(startupRuntimeState);
    this.runtimeStore.dispatch(actions.setAppVersion(app.getVersion()));
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

  protected setSavedWindowStates(windowStates: WindowStates): void {
    this.fileStore.set("windowStates", windowStates);
  }

  protected storeSyncer = (event: Electron.IpcMainEvent): void => {
    event.sender.send("updateStore", this.runtimeStore.getState());
  };

  protected runtimeStoreSubscriber = (): void => {
    // update file store on changes
    this.setSavedSettings(this.runtimeStore.getState().settings);
    this.setSavedWindowStates(this.runtimeStore.getState().windowStates);
  };

  destroy(): void {
    ipcMain.removeListener("syncStores", this.storeSyncer);
    this.unsubscriber();
  }
}

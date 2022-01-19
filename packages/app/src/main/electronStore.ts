import ElectronStore from "electron-store";
import { ApplicationSettings, ApplicationState } from "../redux/state";
import { defaultSettings, ReduxStore, slice, startupMatchData } from "../redux/slice";
import { configureMainStore } from "../redux/configureStoreMain";
import { AnyAction, Unsubscribe } from "@reduxjs/toolkit";
import { ipcMain } from "electron";

export class ApplicationStore {
  runtimeStore: ReduxStore;
  protected fileStore: ElectronStore<any>;
  protected unsubscriber: Unsubscribe;

  constructor() {
    const electronStoreSchema = {
      settings: {
        default: defaultSettings
      }
    }
    this.fileStore = new ElectronStore({
      schema: electronStoreSchema
    });
    //temporary reset during development
    //this.fileStore.clear();
    //this.setSavedSettings(defaultSettings);


  }

  initializeRuntimeStore() {
    const savedSettings = this.fileStore.get("settings") as ApplicationSettings;
    // initialize runtime state
    const startupRuntimeState: ApplicationState = {
      settings: defaultSettings,
      match: startupMatchData,
      updateCounter: 0
    };
    if (savedSettings) {
      startupRuntimeState.settings = savedSettings;
    }
    this.runtimeStore = configureMainStore(startupRuntimeState);
    this.unsubscriber = this.runtimeStore.subscribe(this.runtimeStoreSubscriber);

    // Used to sync redux stores on renderers with the main store when they get created
    ipcMain.on('syncStores', this.storeSyncer);
  }

  getSavedSettings() {
    return this.fileStore.get("settings") as ApplicationSettings;
  }

  getState() {
    return this.runtimeStore.getState();
  }

  dispatch(action: AnyAction) {
    this.runtimeStore.dispatch(action);
  }

  protected setSavedSettings(settings: ApplicationSettings) {
    this.fileStore.set("settings", settings);
  }

  protected storeSyncer = (event: Electron.IpcMainEvent) => {
    event.sender.send("updateStore", this.runtimeStore.getState());
  }

  protected runtimeStoreSubscriber = () => {
    // update file store on changes
    this.setSavedSettings(this.runtimeStore.getState().settings);
  }

  destroy() {
    ipcMain.removeListener('syncStores', this.storeSyncer);
    this.unsubscriber();
  }
}

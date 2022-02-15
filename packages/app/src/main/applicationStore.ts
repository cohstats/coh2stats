import ElectronStore from "electron-store";
import { ApplicationSettings, ApplicationState, WindowStates } from "../redux/state";
import { actions, ReduxStore } from "../redux/slice";
import { configureMainStore } from "../redux/configureStoreMain";
import { AnyAction, Unsubscribe } from "@reduxjs/toolkit";
import { app } from "electron";
import { defaultSettings, defaultWindowStates, startupGameData } from "../redux/defaultState";
import axios from "axios";
import config from "./config";

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
    // check if app is up to date
    // const requestCurrentVersionURL = config.checkCurrentVersionLocalDevURL; // for development
    const requestCurrentVersionURL = config.checkCurrentVersionURL;
    axios.get(requestCurrentVersionURL).then(
      (response) => {
        const data = response.data;
        if (response.status === 200) {
          this.runtimeStore.dispatch(
            actions.setCurrentAppInfos({
              version: data.version,
              releaseInfo: data.link,
              downloadLink: data.downloadLink,
            }),
          );
        }
      },
      (reason) => {
        console.error("Couldn't check if app is up to date: Web request failed");
      },
    );
    this.unsubscriber = this.runtimeStore.subscribe(this.runtimeStoreSubscriber);
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

  protected runtimeStoreSubscriber = (): void => {
    // update file store on changes
    this.setSavedSettings(this.runtimeStore.getState().settings);
    this.setSavedWindowStates(this.runtimeStore.getState().windowStates);
  };

  destroy(): void {
    this.unsubscriber();
  }
}

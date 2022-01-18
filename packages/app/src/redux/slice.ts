import { createSlice, PayloadAction, Slice, Store } from "@reduxjs/toolkit";
import { ApplicationSettings, ApplicationState, MatchData } from "./state";

export const defaultSettings: ApplicationSettings = {
  coh2LogFileFound: false,
  coh2LogFileLocation: "",
  updateInterval: 2,
  runInTray: true,
  openLinksInBrowser: false,
  gameNotification: true,
}

export const startupMatchData: MatchData = {
  display: false,
  left: {
    solo: [],
    teams: []
  },
  right: {
    solo: [],
    teams: []
  }
}

export const initialState: ApplicationState = {
  settings: defaultSettings,
  match: startupMatchData,
  updateCounter: 0
}

export const slice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLogFileFound: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.coh2LogFileFound = payload;
    },
    setLogFilePath: (state, { payload }: PayloadAction<string>) => {
      state.settings.coh2LogFileLocation = payload;
    },
    setUpdateInterval: (state, { payload }: PayloadAction<number>) => {
      state.settings.updateInterval = payload;
    },
    setRunInTray: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.runInTray = payload;
    },
    setOpenLinksInBrowser: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.openLinksInBrowser = payload;
    },
    setGameNotification: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.gameNotification = payload;
    },
    setMatchData: (state, { payload }: PayloadAction<MatchData>) => {
      state.match = payload;
    },
    update: (state, { payload }: PayloadAction) => {
      state.updateCounter = state.updateCounter + 1;
    },
  }
});

export const selectSettings = (state: ApplicationState) => state.settings;
export const selectMatch = (state: ApplicationState) => state.match;

export type ReduxStore = Store<ApplicationState>;
export const actions = slice.actions;
export default slice.reducer;

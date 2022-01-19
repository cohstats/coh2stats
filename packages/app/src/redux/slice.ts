import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import { ApplicationSettings, ApplicationState, MatchData, LadderStats, SideData } from "./state";

export const defaultSettings: ApplicationSettings = {
  coh2LogFileFound: false,
  coh2LogFileLocation: "",
  updateInterval: 2,
  runInTray: true,
  openLinksInBrowser: false,
  gameNotification: true,
};

export const startupMatchData: MatchData = {
  display: false,
  left: {
    solo: [],
    teams: [],
  },
  right: {
    solo: [],
    teams: [],
  },
};

export const initialState: ApplicationState = {
  settings: defaultSettings,
  match: startupMatchData,
  updateCounter: 0,
};

const cloneLadderStatArray = (array: LadderStats[]) => {
  return array.map((ladderStat) => {
    const members = ladderStat.members.map((member) => Object.assign({}, member));
    const newLadderStat = Object.assign({}, ladderStat);
    newLadderStat.members = members;
    return newLadderStat;
  });
};
const cloneSideData = (sideData: SideData): SideData => {
  return {
    solo: cloneLadderStatArray(sideData.solo),
    teams: cloneLadderStatArray(sideData.teams),
  };
};

export const slice = createSlice({
  name: "application",
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
    setStore: (state, { payload }: PayloadAction<ApplicationState>) => {
      state.match = payload.match;
      state.settings = payload.settings;
      state.updateCounter = payload.updateCounter;
    },
    update: (state, { payload }: PayloadAction) => {
      state.settings = Object.assign({}, state.settings);
      const newMatchData: MatchData = {
        display: state.match.display,
        left: cloneSideData(state.match.left),
        right: cloneSideData(state.match.right),
      };
      state.match = newMatchData;
      state.updateCounter = state.updateCounter + 1;
    },
  },
});

export const selectSettings = (state: ApplicationState): ApplicationSettings => state.settings;
export const selectMatch = (state: ApplicationState): MatchData => state.match;

export type ReduxStore = Store<ApplicationState>;
export const actions = slice.actions;
export default slice.reducer;

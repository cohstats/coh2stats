import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import { defaultSettings, defaultWindowStates, startupGameData } from "./defaultState";
import {
  ApplicationSettings,
  ApplicationState,
  GameData,
  GameState,
  LadderStats,
  SideData,
  StreamOverlayPositions,
  WindowState,
  WindowStates,
} from "./state";

export const initialState: ApplicationState = {
  settings: defaultSettings,
  windowStates: defaultWindowStates,
  game: startupGameData,
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
    side: sideData.side,
    solo: cloneLadderStatArray(sideData.solo),
    teams: cloneLadderStatArray(sideData.teams),
  };
};

export const slice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAppVersion: (state, { payload }: PayloadAction<string>) => {
      state.settings.appVersion = payload;
    },
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
    setStreamOverlay: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.streamOverlay = payload;
    },
    setStreamOverlayPort: (state, { payload }: PayloadAction<number>) => {
      if (Number.isInteger(payload) && payload >= 0 && payload <= 65535) {
        state.settings.streamOverlayPort = payload;
      }
    },
    setStreamOverlayPortFree: (state, { payload }: PayloadAction<boolean>) => {
      state.settings.streamOverlayPortFree = payload;
    },
    setStreamOverlayPosition: (state, { payload }: PayloadAction<StreamOverlayPositions>) => {
      state.settings.streamOverlayPosition = payload;
    },
    setMainWindowState: (state, { payload }: PayloadAction<WindowState>) => {
      state.windowStates.main = payload;
    },
    setSettingsWindowState: (state, { payload }: PayloadAction<WindowState>) => {
      state.windowStates.settings = payload;
    },
    setAboutWindowState: (state, { payload }: PayloadAction<WindowState>) => {
      state.windowStates.about = payload;
    },
    setWebWindowState: (state, { payload }: PayloadAction<WindowState>) => {
      state.windowStates.web = payload;
    },
    setGameData: (state, { payload }: PayloadAction<GameData>) => {
      state.game = payload;
    },
    setGameState: (state, { payload }: PayloadAction<GameState>) => {
      state.game.state = payload;
    },
    setStore: (state, { payload }: PayloadAction<ApplicationState>) => {
      state.game = payload.game;
      state.settings = payload.settings;
      state.updateCounter = payload.updateCounter;
    },
    update: (state, { payload }: PayloadAction) => {
      // make a deep copy of state
      state.settings = Object.assign({}, state.settings);
      const newWindowStates: WindowStates = {
        main: Object.assign({}, state.windowStates.main),
        settings: Object.assign({}, state.windowStates.settings),
        about: Object.assign({}, state.windowStates.settings),
        web: Object.assign({}, state.windowStates.settings),
      };
      state.windowStates = newWindowStates;
      const newGameData: GameData = {
        found: state.game.found,
        state: state.game.state,
        type: state.game.type,
        map: state.game.map,
        winCondition: state.game.winCondition,
        left: cloneSideData(state.game.left),
        right: cloneSideData(state.game.right),
      };
      state.game = newGameData;
      state.updateCounter = state.updateCounter + 1;
    },
  },
});

export const selectAppVersion = (state: ApplicationState): string => state.settings.appVersion;
export const selectSettings = (state: ApplicationState): ApplicationSettings => state.settings;
export const selectGame = (state: ApplicationState): GameData => state.game;

export type ReduxStore = Store<ApplicationState>;
export const actions = slice.actions;
export default slice.reducer;

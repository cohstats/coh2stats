import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import {
  ApplicationSettings,
  ApplicationState,
  GameData,
  LadderStats,
  SideData,
  StreamOverlayPositions,
} from "./state";

export const defaultSettings: ApplicationSettings = {
  coh2LogFileFound: false,
  coh2LogFileLocation: "",
  updateInterval: 2,
  runInTray: true,
  openLinksInBrowser: false,
  gameNotification: true,
  streamOverlay: false,
  streamOverlayPort: 47824,
  streamOverlayPortFree: true,
  streamOverlayPosition: "top",
};

export const startupGameData: GameData = {
  found: false,
  started: false,
  ended: false,
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
    setGameData: (state, { payload }: PayloadAction<GameData>) => {
      state.game = payload;
    },
    setGameStarted: (state, { payload }: PayloadAction<boolean>) => {
      state.game.started = payload;
    },
    setGameEnded: (state, { payload }: PayloadAction<boolean>) => {
      state.game.ended = payload;
    },
    setStore: (state, { payload }: PayloadAction<ApplicationState>) => {
      state.game = payload.game;
      state.settings = payload.settings;
      state.updateCounter = payload.updateCounter;
    },
    update: (state, { payload }: PayloadAction) => {
      state.settings = Object.assign({}, state.settings);
      const newGameData: GameData = {
        found: state.game.found,
        started: state.game.started,
        ended: state.game.ended,
        left: cloneSideData(state.game.left),
        right: cloneSideData(state.game.right),
      };
      state.game = newGameData;
      state.updateCounter = state.updateCounter + 1;
    },
  },
});

export const selectSettings = (state: ApplicationState): ApplicationSettings => state.settings;
export const selectGame = (state: ApplicationState): GameData => state.game;

export type ReduxStore = Store<ApplicationState>;
export const actions = slice.actions;
export default slice.reducer;

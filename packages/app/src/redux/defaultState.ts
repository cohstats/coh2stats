import { ApplicationSettings, GameData, WindowStates } from "./state";

export const defaultSettings: ApplicationSettings = {
  appVersion: "0.0.0",
  coh2LogFileFound: false,
  coh2LogFileLocation: "",
  updateInterval: 2,
  runInTray: false,
  openLinksInBrowser: false,
  gameNotification: false,
  streamOverlay: false,
  streamOverlayPort: 47824,
  streamOverlayPortFree: true,
  streamOverlayPosition: "top",
  twitchExtension: false,
  twitchExtensionConfigStep: 0,
  twitchExtensionConfigStatus: "start",
  twitchExtensionPasswordHash: "",
  twitchExtensionUUID: "",
  twitchExtensionSecret: "",
  theme: "light",
};

export const defaultWindowStates: WindowStates = {
  main: {
    height: 750,
    width: 1280,
    maximized: false,
  },
  settings: {
    height: 700,
    width: 700,
    maximized: false,
  },
  web: {
    height: 800,
    width: 1260,
    maximized: false,
  },
};

export const startupGameData: GameData = {
  found: false,
  uniqueId: "",
  state: "closed",
  map: "",
  winCondition: "",
  type: "custom",
  left: {
    side: "mixed",
    solo: [],
    teams: [],
    averageLevel: undefined,
    averageWinRatio: undefined,
  },
  right: {
    side: "mixed",
    solo: [],
    teams: [],
    averageLevel: undefined,
    averageWinRatio: undefined,
  },
  mapWinRatioLeft: undefined,
  winProbabilityLeft: undefined,
};

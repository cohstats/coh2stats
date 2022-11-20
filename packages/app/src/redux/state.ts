export type ApplicationWindows = "main" | "settings" | "web";

export interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  maximized: boolean;
}

export type WindowStates = Record<ApplicationWindows, WindowState>;

export type StreamOverlayPositions = "top" | "left";

export type ApplicationThemes = "light" | "dark";

export type TwitchExtensionConfigStatus = "start" | "process" | "finish" | "error";

export interface ApplicationSettings {
  appVersion: string;
  appNewestVersion?: string;
  appReleaseInfos?: string;
  appUpdateDownloadLink?: string;
  coh2LogFileFound: boolean;
  coh2LogFileLocation: string;
  updateInterval: number;
  runInTray: boolean;
  openLinksInBrowser: boolean;
  gameNotification: boolean;
  streamOverlay: boolean;
  streamOverlayPort: number;
  streamOverlayPortFree: boolean;
  streamOverlayPosition: StreamOverlayPositions;
  twitchExtension: boolean;
  twitchExtensionConfigStep: 0 | 1 | 2; // 0 = setPassword | 1 = configuration | 2 = success | 3 = fail
  twitchExtensionConfigStatus: TwitchExtensionConfigStatus;
  twitchExtensionPasswordHash: string;
  twitchExtensionUUID: string;
  twitchExtensionSecret: string;
  theme: ApplicationThemes;
}

export type Factions = "german" | "west_german" | "aef" | "british" | "soviet";

export interface Member {
  ai: boolean;
  relicID: number;
  name: string;
  faction: Factions;
  steamID: string;
  xp: number;
  level: number;
  country: string;
}

export interface LadderStats {
  members: Member[];
  wins: number;
  losses: number;
  streak: number;
  disputes: number;
  drops: number;
  rank: number;
  teamrank?: number;
  teamId?: number;
  ranktotal: number;
  ranklevel: number;
  regionrank: number;
  regionranktotal: number;
  lastmatchdate: number;
}

export interface SideData {
  side: TeamSide;
  solo: LadderStats[];
  teams: LadderStats[];
  averageLevel: number | undefined;
  averageWinRatio: number | undefined;
}

export type GameType = "classic" | "ai" | "custom";
export type TeamSide = "axis" | "allies" | "mixed";
export type GameState = "closed" | "menu" | "loading" | "ingame";

export interface GameData {
  found: boolean;
  uniqueId: string;
  state: GameState;
  type: GameType;
  map: string;
  winCondition: string;
  left: SideData;
  right: SideData;
  mapWinRatioLeft: number | undefined;
  winProbabilityLeft: number | undefined;
}

export interface MapStatCache {
  requestDate: number;
  data: Record<string, unknown>;
}

export interface ApplicationCache {
  mapStats?: MapStatCache;
}

export interface ApplicationState {
  settings: ApplicationSettings;
  cache: ApplicationCache;
  windowStates: WindowStates;
  game: GameData;
  updateCounter: number;
}

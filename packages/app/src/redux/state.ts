export interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  maximized: boolean;
}

export interface WindowStates {
  main: WindowState;
  settings: WindowState;
  about: WindowState;
  web: WindowState;
}

export type StreamOverlayPositions = "top" | "left";

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
}

export type GameType = "classic" | "ai" | "custom";
export type TeamSide = "axis" | "allies" | "mixed";
export type GameState = "closed" | "menu" | "loading" | "ingame";

export interface GameData {
  found: boolean;
  state: GameState;
  type: GameType;
  map: string;
  winCondition: string;
  left: SideData;
  right: SideData;
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

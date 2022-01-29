export type StreamOverlayPositions = "top" | "left";

export interface ApplicationSettings {
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
  ranktotal: number;
  ranklevel: number;
  regionrank: number;
  regionranktotal: number;
  lastmatchdate: number;
}

export interface SideData {
  solo: LadderStats[];
  teams: LadderStats[];
}

export type GameState = "closed" | "menu" | "loading" | "ingame";

export interface GameData {
  found: boolean;
  state: GameState;
  map: string;
  winCondition: string;
  left: SideData;
  right: SideData;
}

export interface ApplicationState {
  settings: ApplicationSettings;
  game: GameData;
  updateCounter: number;
}

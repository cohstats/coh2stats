interface CommanderData {
  serverID: string;
  iconSmall: string;
  iconlarge: string;
  commanderName: string;
  description: string;
  races: Array<string>;
  abilities: Array<Record<string, any>>;
}

interface IntelBulletinData {
  serverID: string;
  bulletinName: string;
  descriptionShort: string;
  descriptionLong: string;
  icon: string;
  races: Array<string>;
}

type RaceName = "wermacht" | "usf" | "soviet" | "wgerman" | "british";
const validRaceNames = ["wermacht", "usf", "soviet", "wgerman", "british"];

const validStatsTypes = ["1v1", "2v2", "3v3", "4v4", "general"];

interface LeaderBoardStats {
  wins: number;
  streak: number;
  regionranktotal: number;
  drops: number;
  statgroup_id: number;
  regionrank: number;
  rank: number;
  disputes: number;
  ranklevel: number;
  leaderboard_id: number;
  lastmatchdate: number;
  ranktotal: number;
  losses: number;
}

interface LaddersDataObject {
  leaderboardStats: Array<LeaderBoardStats>;
  statGroups: Array<{
    type: number;
    name: string;
    members: Array<Record<string, any>>;
    id: number;
  }>;
  rankTotal: number;
}

interface LaddersDataArrayObject extends LeaderBoardStats {
  change: number | string;
  members: Array<Record<string, any>>;
}

interface PlayerCardDataArrayObject extends LaddersDataArrayObject {
  mode: string;
  percentile: number;
}

export type {
  CommanderData,
  IntelBulletinData,
  RaceName,
  LaddersDataObject,
  LaddersDataArrayObject,
  PlayerCardDataArrayObject,
  LeaderBoardStats,
};
export { validRaceNames, validStatsTypes };

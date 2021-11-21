interface CommanderData {
  serverID: string;
  iconSmall: string;
  iconlarge: string;
  commanderName: string;
  description: string;
  races: Array<string>;
  abilities: Array<CommanderAbility>;
}

type CommanderAbility = {
  name: string;
  description: string;
  commandPoints: string;
  icon: string;
};

interface IntelBulletinData {
  serverID: string;
  bulletinName: string;
  descriptionShort: string;
  descriptionLong: string;
  icon: string;
  races: Array<string>;
}

type RaceName = "wermacht" | "usf" | "soviet" | "wgerman" | "british";
const validRaceNames: Array<RaceName> = ["british", "soviet", "usf", "wermacht", "wgerman"];

const validStatsTypes = ["1v1", "2v2", "3v3", "4v4", "general"];

type statTypesInDbAsType = "1v1" | "2v2" | "3v3" | "4v4";
const statsTypesInDB: Array<statTypesInDbAsType> = ["1v1", "2v2", "3v3", "4v4"];

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

type TypeAnalysisObject = {
  soviet: { wins: number; losses: number };
  wermacht: { wins: number; losses: number };
  wgerman: { wins: number; losses: number };
  british: { wins: number; losses: number };
  usf: { wins: number; losses: number };
  matchCount: number;
  gameTime: number;
  maps: Record<string, number>;
  commanders: {
    soviet: Record<string, number>;
    wermacht: Record<string, number>;
    wgerman: Record<string, number>;
    british: Record<string, number>;
    usf: Record<string, number>;
  };
  intelBulletins: {
    soviet: Record<string, number>;
    wermacht: Record<string, number>;
    wgerman: Record<string, number>;
    british: Record<string, number>;
    usf: Record<string, number>;
  };
  factionMatrix: Record<string, { wins: number; losses: number }>;
};

interface StatsDataObject {
  "1v1": TypeAnalysisObject;
  "2v2": TypeAnalysisObject;
  "3v3": TypeAnalysisObject;
  "4v4": TypeAnalysisObject;
}

export type {
  CommanderData,
  CommanderAbility,
  IntelBulletinData,
  RaceName,
  LaddersDataObject,
  LaddersDataArrayObject,
  PlayerCardDataArrayObject,
  LeaderBoardStats,
  StatsDataObject,
  TypeAnalysisObject,
  statTypesInDbAsType,
};
export { validRaceNames, validStatsTypes, statsTypesInDB };

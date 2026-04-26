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

/**
 * The names are important, can't be changed
 */
const leaderboardsID: Record<string, Record<string, number>> = {
  "1v1": {
    wehrmacht: 4,
    soviet: 5,
    wgerman: 6,
    usf: 7,
    british: 51,
  },
  "2v2": {
    wehrmacht: 8,
    soviet: 9,
    wgerman: 10,
    usf: 11,
    british: 52,
  },
  "3v3": {
    wehrmacht: 12,
    soviet: 13,
    wgerman: 14,
    usf: 15,
    british: 53,
  },
  "4v4": {
    wehrmacht: 16,
    soviet: 17,
    wgerman: 18,
    usf: 19,
    british: 54,
  },
  team2: {
    axis: 20,
    allies: 21,
  },
  team3: {
    axis: 22,
    allies: 23,
  },
  team4: {
    axis: 24,
    allies: 25,
  },
  custom: {
    wehrmacht: 0,
    soviet: 1,
    wgerman: 2,
    usf: 3,
    british: 50,
  },
  AIEasyAxis: {
    "2v2": 26,
    "3v3": 34,
    "4v4": 42,
  },
  AIMediumAxis: {
    "2v2": 28,
    "3v3": 36,
    "4v4": 44,
  },
  AIHardAxis: {
    "2v2": 30,
    "3v3": 38,
    "4v4": 46,
  },
  AIExpertAxis: {
    "2v2": 32,
    "3v3": 40,
    "4v4": 48,
  },
  AIEasyAllies: {
    "2v2": 27,
    "3v3": 35,
    "4v4": 43,
  },
  AIMediumAllies: {
    "2v2": 29,
    "3v3": 37,
    "4v4": 45,
  },
  AIHardAllies: {
    "2v2": 31,
    "3v3": 39,
    "4v4": 47,
  },
  AIExpertAllies: {
    "2v2": 33,
    "3v3": 41,
    "4v4": 49,
  },
};

const levels: Record<string, string> = {
  "2": "6%",
  "3": "14%",
  "4": "20%",
  "5": "25%",
  "6": "35%",
  "7": "45%",
  "8": "55%",
  "9": "62%",
  "10": "69%",
  "11": "75%",
  "12": "80%",
  "13": "85%",
  "14": "90%",
  "15": "95%",
  "16": "rank 81-200",
  "17": "rank 37-80",
  "18": "rank 14-36",
  "19": "rank 3-13",
  "20": "rank 1-2",
};

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
export { validRaceNames, validStatsTypes, statsTypesInDB, leaderboardsID, levels };

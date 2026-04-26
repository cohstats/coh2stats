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
  // Added for player cards with historic player data
  historic?: HistoricLeaderBoardStat;
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

interface FirebaseTimeStampObject {
  _seconds: number;
  _nanoseconds: number;
}

interface HistoryOfLeaderBoardStat {
  w: number; // wins
  l: number; // losses
  r: number; // ranks
  rl: number; // rank level
  ts: FirebaseTimeStampObject; // timestamp
}

interface HistoricLeaderBoardStat {
  leaderboard_id: number;
  wins: number;
  losses: number;
  rank: number;
  ranklevel: number;
  statgroup_id: number;
  history: Array<HistoryOfLeaderBoardStat>;
}

type HistoricLeaderBoardStats = Record<string, HistoricLeaderBoardStat>;

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
  totalGames?: number;
};

interface StatsDataObject {
  "1v1": TypeAnalysisObject;
  "2v2": TypeAnalysisObject;
  "3v3": TypeAnalysisObject;
  "4v4": TypeAnalysisObject;
}

interface StatsCurrentLiveGames {
  games: {
    "1v1": number;
    "2v2": number;
    "3v3": number;
    "4v4": number;
    AI: number;
    custom: number;
  };
  players: {
    "1v1": number;
    "2v2": number;
    "3v3": number;
    "4v4": number;
    AI: number;
    custom: number;
  };
  totalPlayersAutomatch: number;
  totalPlayersIngame: number;
  timeStamp?: number;
}

type LivePlayerProfile = {
  currentID: number;
  profile_id: number;
  name: string;
  unknown3: string;
  alias: string;
  unknown5: string;
  unknown6: number;
  xp: number;
  level: number;
  unknown9: number;
  unknown10?: null;
  steamid: string;
  unknown12: number;
};

type LiveGame = {
  id: number;
  unknown1: number;
  unknown2: string;
  creator_profile_id: number;
  unknown4: number;
  description: string;
  unknown6: number;
  mapname: string;
  options?: string;
  unknown9: number;
  maxplayers: number;
  slotinfo?: string;
  unknown12: number;
  players?: Array<{
    matchid: number;
    profile_id: number;
    rank: number;
    unknown3: number;
    race_id: number;
    teamid: number;
    player_profile?: LivePlayerProfile;
  }>;
  current_observers: number;
  max_observers: number;
  unknown16: number;
  unknown17: number;
  unknown18: number;
  unknown19: number;
  startgametime: number;
  server: string;
};

/**
 * This is the data type of the match which has been already processed
 * and modified. Aka it's not the RAW match data from the API.
 */
interface ProcessedMatch {
  id: number;
  creator_profile_id: number;
  mapname: string;
  maxplayers: number;
  matchtype_id: number;
  description: string;
  startgametime: number;
  completiontime: number;
  matchhistoryreportresults: Array<PlayerReport>;
  matchhistoryitems: Array<Record<string, any>>;
  profile_ids: Array<number>;
  steam_ids: Array<string>;
}

const resultType = {
  lose: 0,
  win: 1,
};

const axisRaceIds = [0, 2];
const alliesRaceIds = [1, 3, 4];

/**
 * This is the object inside matchhistoryreportresults
 */
interface PlayerReport {
  matchhistory_id: number;
  profile_id: number;
  resulttype: number;
  teamid: number;
  race_id: number;
  counters: string;
  profile: Record<string, any>;
}

/**
 * API response type for player card endpoint
 */
interface PlayerCardAPIObject {
  relicPersonalStats: Record<string, any>;
  steamProfile: Record<string, any>;
  playerMatches: Array<Record<string, any>>;
  playTime: null | number;
  playerInfo: null | Record<string, any>;
}

/**
 * API response type for player matches endpoint
 */
interface PlayerMatchesResponse {
  playerMatches: Array<ProcessedMatch>;
}

/**
 * API response type for search players endpoint
 */
interface SearchPlayersResponse {
  foundProfiles: Record<string, any>;
}

/**
 * Player stats data from Firestore
 * Contains overall player count and activity statistics
 */
interface PlayerStatsData {
  count: number;
  last24hours: number;
  last30days: number;
  last7days: number;
  countries: Record<string, number>;
  timeStamp: number; // Timestamp in milliseconds
}

/**
 * Relic API Types - Raw responses from Relic's COH2 API
 */

interface RelicLeaderboardStat {
  statgroup_id: number;
  leaderboard_id: number;
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

interface RelicStatGroupMember {
  profile_id: number;
  name: string;
  alias: string;
  personal_statgroup_id: number;
  xp: number;
  level: number;
  leaderboardregion_id: number;
  country: string;
}

interface RelicStatGroup {
  id: number;
  type: number;
  name: string;
  members: RelicStatGroupMember[];
}

interface RelicLeaderboardResponse {
  result: {
    code: number;
    message: string;
  };
  statGroups: RelicStatGroup[];
  leaderboardStats: RelicLeaderboardStat[];
}

export type {
  ProcessedMatch,
  StatsCurrentLiveGames,
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
  LiveGame,
  HistoricLeaderBoardStats,
  FirebaseTimeStampObject,
  PlayerCardAPIObject,
  PlayerMatchesResponse,
  SearchPlayersResponse,
  PlayerStatsData,
  RelicLeaderboardStat,
  RelicStatGroupMember,
  RelicStatGroup,
  RelicLeaderboardResponse,
};
export {
  validRaceNames,
  validStatsTypes,
  statsTypesInDB,
  resultType,
  axisRaceIds,
  alliesRaceIds,
  leaderboardsID,
  levels,
};

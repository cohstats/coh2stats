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
};
export {
  validRaceNames,
  validStatsTypes,
  statsTypesInDB,
  resultType,
  axisRaceIds,
  alliesRaceIds,
};

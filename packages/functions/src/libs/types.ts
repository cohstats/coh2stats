// Leaderboards types

type RelicAPIResult = {
  code: number;
  message: string;
};

type RawPlayerProfile = {
  profile_id: number;
  name: string;
  alias: string;
  personal_statgroup_id?: number;
  xp?: number;
  level: number;
  leaderboardregion_id?: number;
  country: string;
};

type RawStatGroup = {
  id: number;
  name?: string;
  type?: number;
  members: Array<RawPlayerProfile>;
};

type RawLeaderboardStat = {
  statgroup_id: number;
  leaderboard_id: number;
  wins: number;
  losses: number;
  streak: number;
  disputes: number;
  drops: number;
  rank: number;
  ranktotal?: number;
  regionrank?: number;
  regionranktotal?: number;
  ranklevel: number;
  lastmatchdate: number;
};

export interface RawLaddersObject {
  result?: RelicAPIResult;
  statGroups: Array<RawStatGroup>;
  leaderboardStats: Array<RawLeaderboardStat>;
  rankTotal: number;
}

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

type TmpDict<T> = Record<string, T | number>;
interface StatDict extends TmpDict<StatDict> {}

type frequencyType = "daily" | "week" | "month" | "quarter" | "year";

interface SpecificStatsForType {
  british: {
    losses: number;
    wins: number;
  };
  soviet: {
    losses: number;
    wins: number;
  };
  wermacht: {
    losses: number;
    wins: number;
  };
  usf: {
    losses: number;
    wins: number;
  };
  wgerman: {
    losses: number;
    wins: number;
  };
  matchCount: number;
  maps: Record<string, number>;
  commanders: {
    british: Record<string, number>;
    soviet: Record<string, number>;
    usf: Record<string, number>;
    wermacht: Record<string, number>;
    wgerman: Record<string, number>;
    unknown: Record<string, number>;
  };
  intelBulletins: {
    british: Record<string, number>;
    soviet: Record<string, number>;
    usf: Record<string, number>;
    wermacht: Record<string, number>;
    wgerman: Record<string, number>;
    unknown: Record<string, number>;
  };
}

interface FullStatInterface {
  "1v1": SpecificStatsForType;
  "2v2": SpecificStatsForType;
  "3v3": SpecificStatsForType;
  "4v4": SpecificStatsForType;
}

interface SteamApiPlayerInterface {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname: string;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  loccountrycode: string;
}

type RaceNameInLadders = "wehrmacht" | "usf" | "soviet" | "wgerman" | "british";
const validRaceNamesInLadders: Array<RaceNameInLadders | string> = [
  "wehrmacht",
  "usf",
  "soviet",
  "wgerman",
  "british",
];

const validStatsTypes = ["1v1", "2v2", "3v3", "4v4"];

type TypeOfLadder = "1v1" | "2v2" | "3v3" | "4v4" | "team2" | "team3" | "team4";
const validLadderNonTeamTypes = ["1v1", "2v2", "3v3", "4v4"];
const validLadderTypes = ["1v1", "2v2", "3v3", "4v4", "team2", "team3", "team4"];

interface steamIDsInLadderInterface {
  "1v1": Array<string>; //string is in the format of just number  ( does not include /steam/)
  "2v2": Array<string>;
  "3v3": Array<string>;
  "4v4": Array<string>;
}

export {
  RaceNameInLadders,
  TypeOfLadder,
  validRaceNamesInLadders,
  validStatsTypes,
  validLadderTypes,
  ProcessedMatch,
  PlayerReport,
  StatDict,
  frequencyType,
  FullStatInterface,
  SteamApiPlayerInterface,
  steamIDsInLadderInterface,
  validLadderNonTeamTypes,
};

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

export { ProcessedMatch, PlayerReport, StatDict, frequencyType, FullStatInterface };

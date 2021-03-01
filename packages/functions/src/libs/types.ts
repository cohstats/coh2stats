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

export { ProcessedMatch, PlayerReport, StatDict };

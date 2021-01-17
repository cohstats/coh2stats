/**
 * This is the data type of the match which has been already processed
 * and modified. Aka it's not the RAW match data from the API.
 */
interface ProcessedMatch {
    creator_profile_id: number;
    mapname: string;
    maxplayers: number;
    matchtype_id: number;
    description: string;
    startgametime: number;
    completiontime: number;
    matchhistoryreportresults: Array<Record<string, any>>;
    matchhistoryitems: Array<Record<string, any>>;
    profile_ids: Array<number>;
    steam_ids: Array<string>;
}



import { RawLaddersObject } from "../types";

/**
 * We don't care about this data and it just takes space ...
 * WARNING: Mutation of the object!
 * @param data
 */
const cleanLaddersData = (data: RawLaddersObject): RawLaddersObject => {
  delete data.result;
  data.leaderboardStats = data.leaderboardStats.map((statObject) => {
    delete statObject.rankTotal;
    delete statObject.regionRank;
    delete statObject.regionRankTotal;
    return statObject;
  });

  data.statGroups = data.statGroups.map((statObject) => {
    delete statObject.name;
    delete statObject.type;

    statObject.members = statObject.members.map((profile) => {
      delete profile.personal_statgroup_id;
      delete profile.xp;
      delete profile.leaderboardregion_id;
      return profile;
    });

    return statObject;
  });

  return data;
};

export { cleanLaddersData };

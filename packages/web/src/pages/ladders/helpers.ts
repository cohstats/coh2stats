import { LaddersDataArrayObject, LaddersDataObject } from "../../coh/types";

const findAndMergeStatGroups = (
  laddersDataObject: LaddersDataObject,
): Array<LaddersDataArrayObject> => {
  if (!laddersDataObject) return [];

  const statGroups = laddersDataObject.statGroups;
  const leaderboardStats = laddersDataObject.leaderboardStats;

  const statGroupsArray: Array<LaddersDataArrayObject> = [];

  for (const stat of leaderboardStats) {
    const statGroup = statGroups.find((group) => {
      return stat.statgroup_id === group.id;
    });

    statGroupsArray.push({
      ...stat,
      ...{
        members: statGroup?.members,
      },
    } as LaddersDataArrayObject);
  }

  return statGroupsArray;
};

export { findAndMergeStatGroups };

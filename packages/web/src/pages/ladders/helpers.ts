import { LaddersDataArrayObject, LaddersDataObject } from "../../coh/types";

const findAndMergeStatGroups = (
  laddersDataObject: LaddersDataObject,
): Array<LaddersDataArrayObject> => {
  const statGroups = laddersDataObject.statGroups;
  const leaderboardStats = laddersDataObject.leaderboardStats;

  const statGroupsArray: Array<LaddersDataArrayObject> = [];

  for (const stat of leaderboardStats) {
    const statGroup = statGroups.find((group) => {
      return stat.statgroup_id === group.id;
    });

    statGroupsArray.push(<LaddersDataArrayObject>{
      ...stat,
      ...{
        members: statGroup?.members,
      },
    });
  }

  return statGroupsArray;
};

export { findAndMergeStatGroups };

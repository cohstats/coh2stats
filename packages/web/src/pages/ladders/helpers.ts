import { LaddersDataArrayObject, LaddersDataObject } from "../../coh/types";

const findAndMergeStatGroups = (
  laddersDataObject: LaddersDataObject,
  laddersHistoryObject: LaddersDataObject,
): Array<LaddersDataArrayObject> => {
  if (!laddersDataObject) return [];

  const statGroups = laddersDataObject.statGroups;
  const leaderboardStats = laddersDataObject.leaderboardStats;

  const statGroupsArray: Array<LaddersDataArrayObject> = [];

  for (const stat of leaderboardStats) {
    const statGroup = statGroups.find((group) => {
      return stat.statgroup_id === group.id;
    });

    let change: number | string = 0;

    if (laddersHistoryObject) {
      const oldHistoryObject = laddersHistoryObject.leaderboardStats.find((statsObject) => {
        return statsObject.statgroup_id === stat.statgroup_id;
      });

      if (oldHistoryObject) {
        change = oldHistoryObject.rank - stat.rank;
      } else {
        change = "new";
      }
    }

    statGroupsArray.push({
      ...stat,
      ...{
        members: statGroup?.members,
        change: change,
      },
    } as LaddersDataArrayObject);
  }

  return statGroupsArray;
};

const isTeamGame = (type: string) => {
  return !["1v1", "2v2", "3v3", "4v4"].includes(type);
};

export { findAndMergeStatGroups, isTeamGame };

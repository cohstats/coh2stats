import { LaddersDataArrayObject, LaddersDataObject } from "./types";
import { levels } from "./coh2-api";

const sortArrayOfObjectsByTheirPropertyValue = (
  mapsData: Array<Record<string, string>>,
): Array<Record<string, string>> => {
  return mapsData.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });
};

const getExportedIconPath = (name: string): string => {
  return `/resources/exportedIcons/${name}.png`;
};

/**
 * Small is 32px
 * @param name
 * @param size
 */
const getGeneralIconPath = (name: string, size: "normal" | "small" = "normal"): string => {
  // We have typo in the system and DB, sometimes it's wermacht and sometimes wehrmacht
  if (name === "wehrmacht") {
    name = "wermacht";
  }

  if (size === "small") {
    return `/resources/generalIcons/${name}_small.png`;
  } else {
    return `/resources/generalIcons/${name}.png`;
  }
};

/**
 * Extracts just the string ID from the steam name used in the results of API.
 * @param name In format "/steam/76561198131099369"
 */
const convertSteamNameToID = (name: string): string => {
  const res = name.match(/\/steam\/(\d+)/);
  if (res) return res[1];
  return "";
};

const isTeamGame = (type: string) => {
  return !["1v1", "2v2", "3v3", "4v4"].includes(type);
};

const findAndMergeStatGroups = (
  laddersDataObject: LaddersDataObject,
  laddersHistoryObject: LaddersDataObject | null,
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

const levelToText = (level: string | number): string => {
  level = `${level}`;

  return levels[level] || "unknown level";
};

export {
  sortArrayOfObjectsByTheirPropertyValue,
  getExportedIconPath,
  getGeneralIconPath,
  convertSteamNameToID,
  isTeamGame,
  findAndMergeStatGroups,
  levelToText,
};

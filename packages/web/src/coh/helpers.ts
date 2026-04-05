import { LaddersDataArrayObject, LaddersDataObject, RelicLeaderboardResponse } from "./types";
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
  laddersDataObject: LaddersDataObject | undefined,
  laddersHistoryObject: LaddersDataObject | null | undefined,
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

/**
 * Maps Relic's raw leaderboard response to the app's LaddersDataObject format
 *
 * @param relicResponse - Raw response from Relic API
 * @returns Mapped leaderboard data in app format
 * @throws Error if the Relic response indicates failure (result.code !== 0)
 *
 * @example
 * ```typescript
 * const relicData = await fetchLeaderboardStats(4);
 * const appData = mapRelicResponseToLaddersData(relicData);
 * ```
 */
export const mapRelicResponseToLaddersData = (
  relicResponse: RelicLeaderboardResponse
): LaddersDataObject => {
  if (relicResponse.result.code !== 0) {
    throw new Error(
      `Relic API returned error code ${relicResponse.result.code}: ${relicResponse.result.message}`
    );
  }

  return {
    leaderboardStats: relicResponse.leaderboardStats.map((stat) => ({
      wins: stat.wins,
      streak: stat.streak,
      regionranktotal: stat.regionranktotal,
      drops: stat.drops,
      statgroup_id: stat.statgroup_id,
      regionrank: stat.regionrank,
      rank: stat.rank,
      disputes: stat.disputes,
      ranklevel: stat.ranklevel,
      leaderboard_id: stat.leaderboard_id,
      lastmatchdate: stat.lastmatchdate,
      ranktotal: stat.ranktotal,
      losses: stat.losses,
    })),
    statGroups: relicResponse.statGroups.map((group) => ({
      type: group.type,
      name: group.name,
      members: group.members,
      id: group.id,
    })),
    rankTotal: relicResponse.leaderboardStats[0]?.ranktotal ?? 0,
  };
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

import {
  RaceNameInLadders,
  steamIDsInLadderInterface,
  TypeOfLadder,
  validLadderNonTeamTypes,
  validRaceNamesInLadders,
} from "./types";
import { getLadderDocRef, getTopLadderUniquePlayersDocRef } from "../fb-paths";
import { convertSteamNameToID } from "./helpers";
import * as functions from "firebase-functions";

const extractTheProfileIDs = (data: Record<string, any>): Set<string> => {
  const profileIDs: Set<string> = new Set();

  const { statGroups } = data;

  for (const group of statGroups) {
    for (const member of group["members"]) {
      const name = member["name"];
      profileIDs.add(convertSteamNameToID(name));
    }
  }

  return profileIDs;
};

const getLadder = async (
  timestamp: string | number,
  type: TypeOfLadder,
  faction: RaceNameInLadders | "allies" | "axis",
) => {
  return await getLadderDocRef(timestamp, type, faction).get();
};

const getAllNameIDsInLadderType = async (timestamp: string | number, type: TypeOfLadder) => {
  let profileIDs: Set<string> = new Set();

  if (validLadderNonTeamTypes.includes(type)) {
    // this means it's 1v1,2v2,3v3,4v4
    for (const factionName of validRaceNamesInLadders) {
      const ladderData = (
        await getLadder(timestamp, type, factionName as RaceNameInLadders)
      ).data();
      const extractedIds = extractTheProfileIDs(ladderData ? ladderData : { statGroups: [] });
      functions.logger.debug(
        `Extracting ladder player IDs for ${type} - ${factionName}. Found ${extractedIds.size} unique players`,
      );
      profileIDs = new Set<string>([...profileIDs, ...extractedIds]);
    }
  } else {
    // this means it's team2,team3,team4
    const teamTypes: Array<"allies" | "axis"> = ["allies", "axis"];
    for (const teamType of teamTypes) {
      const ladderData = (await getLadder(timestamp, type, teamType)).data();
      const extractedIds = extractTheProfileIDs(ladderData ? ladderData : { statGroups: [] });
      functions.logger.debug(
        `Extracting ladder player IDs for ${type} - ${teamType}. Found ${extractedIds.size} unique players`,
      );
      profileIDs = new Set<string>([...profileIDs, ...extractedIds]);
    }
  }

  functions.logger.debug(
    `In total found ${profileIDs.size} unique players for ${type} on date ${timestamp}`,
  );

  return profileIDs;
};

const saveLadderUniquePlayerStats = async (
  timestamp: string | number,
  ids: steamIDsInLadderInterface,
) => {
  const topUniquePlayersDoc = getTopLadderUniquePlayersDocRef(timestamp, "daily");
  try {
    await topUniquePlayersDoc.set({
      "1v1": ids["1v1"].length,
      "2v2": ids["2v2"].length,
      "3v3": ids["3v3"].length,
      "4v4": ids["4v4"].length,
    });
  } catch (e) {
    functions.logger.error(
      `Failed to save top top Unique Players Doc ${topUniquePlayersDoc.path}`,
      timestamp,
      e,
    );
  }
};

const getLadderNameIDsForTimestamp = async (
  timestamp: string | number,
): Promise<steamIDsInLadderInterface> => {
  const result = {
    "1v1": Array.from(await getAllNameIDsInLadderType(timestamp, "1v1")),
    "2v2": Array.from(
      new Set([
        ...(await getAllNameIDsInLadderType(timestamp, "2v2")),
        ...(await getAllNameIDsInLadderType(timestamp, "team2")),
      ]),
    ),
    "3v3": Array.from(
      new Set([
        ...(await getAllNameIDsInLadderType(timestamp, "3v3")),
        ...(await getAllNameIDsInLadderType(timestamp, "team3")),
      ]),
    ),
    "4v4": Array.from(
      new Set([
        ...(await getAllNameIDsInLadderType(timestamp, "4v4")),
        ...(await getAllNameIDsInLadderType(timestamp, "team4")),
      ]),
    ),
  };

  functions.logger.debug(`
    Amount of unique players in modes: 1v1: ${result["1v1"].length}\n
    Amount of unique players in modes: 2v2: ${result["2v2"].length}\n
    Amount of unique players in modes: 3v3: ${result["3v3"].length}\n
    Amount of unique players in modes: 4v4: ${result["4v4"].length}\n
  `);

  await saveLadderUniquePlayerStats(timestamp, result);

  return result;
};

export { extractTheProfileIDs, getLadderNameIDsForTimestamp };

import { RaceNameInLadders, TypeOfLadder, validRaceNamesInLadders } from "./types";
import { getLadderDocRef } from "../fb-paths";

const extractTheProfileIDs = (data: Record<string, any>): Set<string> => {
  const profileIDs: Set<string> = new Set();

  const { statGroups } = data;

  for (const group of statGroups) {
    for (const member of group["members"]) {
      const name = member["name"];
      profileIDs.add(name);
    }
  }

  return profileIDs;
};

const getLadder = async (
  timestamp: string | number,
  type: TypeOfLadder,
  faction: RaceNameInLadders,
) => {
  return await getLadderDocRef(timestamp, type, faction).get();
};

const getAllNameIDsInLadderType = async (timestamp: string | number, type: TypeOfLadder) => {
  let profileIDs: Set<string> = new Set();

  for (const factionName of validRaceNamesInLadders) {
    const ladderData = (await getLadder(timestamp, type, factionName)).data();
    const extractedIds = extractTheProfileIDs(ladderData ? ladderData : { statGroups: [] });
    console.debug(
      `Extracting ladder player IDs for ${type} - ${factionName}. Found ${extractedIds.size} unique players`,
    );
    profileIDs = new Set<string>([...profileIDs, ...extractedIds]);
  }

  console.debug(
    `In total found ${profileIDs.size} unique players for ${type} on date ${timestamp}`,
  );

  return profileIDs;
};

export { extractTheProfileIDs, getAllNameIDsInLadderType };

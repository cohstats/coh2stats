import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getPlayerSearchUrl } from "./libs/coh2-api";
import axios from "axios";
import { convertSteamNameToID } from "./libs/helpers";
import { getSteamPlayerSummaries } from "./libs/steam-api";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 120,
  memory: "128MB",
};

const playerSearchOnRelic = async (name: string): Promise<Array<Record<string, any>>> => {
  const response = await axios.get(getPlayerSearchUrl(name));
  // return only single players group
  if (response.data["statGroups"] != undefined) {
    return response.data["statGroups"].filter((statGroup: Record<string, any>) => {
      return statGroup.type == 1;
    });
  } else {
    return [];
  }
};

const extractSteamId = (relicStatGroupObject: Record<string, any>): string => {
  const steamName = relicStatGroupObject["members"][0]["name"];
  return convertSteamNameToID(steamName);
};

/**
 * This function does a search for the players via relic API and combines the result with the SteamAPI
 * {name: "my custom name"}
 *
 * Returns { foundProfiles: {
 *    76561197963337562: {
 *     relicProfile: {id: 1767439, name: "", type: 1, members: Array(1)}
 *     steamProfile: {steamid: "76561197963337562", communityvisibilitystate: 3, profilestate: 1, personaname: "Ramp", profileurl: "https://steamcommunity.com/profiles/76561197963337562/", …}
 *     },
 *   76561198006427762: {relicProfile: {...}, steamProfile: {...} }
 *   }
 * }
 */
const searchPlayers = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    functions.logger.info(`Searching for players ${JSON.stringify(data)}`);

    const name = data.name;

    if (!name) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'The function must be called with {name: "Steam Nickname"}',
      );
    }

    try {
      const playerGroups = await playerSearchOnRelic(name);
      const steamIDs = playerGroups.reduce((acc: Array<string>, currentValue) => {
        acc.push(extractSteamId(currentValue));
        return acc;
      }, []);

      const steamProfiles = await getSteamPlayerSummaries(steamIDs);
      if (!steamProfiles) {
        throw new functions.https.HttpsError("internal", `Did not found any steam accounts`);
      }

      const foundProfiles: Record<string, Record<"steamProfile" | "relicProfile", any>> = {};

      for (const [key, value] of Object.entries(steamProfiles)) {
        foundProfiles[key] = { steamProfile: value, relicProfile: {} };
      }

      for (const playerGroup of playerGroups) {
        foundProfiles[extractSteamId(playerGroup)]["relicProfile"] = playerGroup;
      }

      return { foundProfiles };
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError("internal", `Error calling calling the API ${e}`);
    }
  });

export { searchPlayers };

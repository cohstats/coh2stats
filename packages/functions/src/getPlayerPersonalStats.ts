import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getPlayerPersonalStatsUrl } from "./libs/coh2-api";
import axios from "axios";
import { getSteamPlayerSummaries } from "./libs/steam-api";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 120,
  memory: "128MB",
};

const getPlayerStatsFromRelic = async (steamID: string) => {
  const url = getPlayerPersonalStatsUrl(steamID);

  const response = await axios.get(url);
  const data = response.data;

  if (data["result"]["message"] === "SUCCESS" || data["result"]["code"] === 0) {
    return {
      statGroups: data["statGroups"],
      leaderboardStats: data["leaderboardStats"],
    };
  } else if (data["result"]["message"] === "UNREGISTERED_PROFILE_NAME") {
    throw "UNREGISTERED_PROFILE_NAME";
  } else {
    console.error(`Error getting player profile data for steamID ${steamID}`, data);
    throw "ERROR GETTING PLAYER PROFILE DATA";
  }
};

/**
 * Returns{
 *   relicPersonalStats: {},
 *   steamProfile: {}
 * }
 */
const getPlayerPersonalStats = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    functions.logger.info(`Getting personal stats for ${JSON.stringify(data)}`);

    const steamID = data.steamID;

    if (!steamID) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'The function must be called with {steamID: "4981651654"}',
      );
    }

    try {
      const PromiseRelicData = getPlayerStatsFromRelic(steamID);
      const PromiseSteamProfile = getSteamPlayerSummaries([steamID]);
      const [relicData, steamProfile] = await Promise.all([
        PromiseRelicData,
        PromiseSteamProfile,
      ]);

      return {
        relicPersonalStats: relicData,
        steamProfile: steamProfile,
      };
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError("internal", `Error calling calling the API ${e}`);
    }
  });

export { getPlayerPersonalStats };

import { getPlayerPersonalStatsUrl } from "../coh2-api";
import axios from "axios";

const getPlayerStatsFromRelic = async (steamID: string): Promise<Record<string, any>> => {
  const url = getPlayerPersonalStatsUrl(steamID);

  const response = await axios.get(url);
  const data = response.data;

  if (data["result"]["message"] === "SUCCESS" || data["result"]["code"] === 0) {
    return {
      statGroups: data["statGroups"],
      leaderboardStats: data["leaderboardStats"],
    };
  } else if (data["result"]["message"] === "UNREGISTERED_PROFILE_NAME") {
    throw new Error("UNREGISTERED_PROFILE_NAME");
  } else {
    console.error(`Error getting player profile data for steamID ${steamID}`, data);
    throw new Error("ERROR GETTING PLAYER PROFILE DATA");
  }
};

export { getPlayerStatsFromRelic };

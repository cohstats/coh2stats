import { steam_api_key } from "../config";
import axios from "axios";
import * as functions from "firebase-functions";
import { SteamApiPlayerInterface } from "./types";

const baseUrl = "http://api.steampowered.com/";

const getSteamPlayerSummariesUrl = (steamIds: Array<string>) => {
  return encodeURI(
    `${baseUrl}ISteamUser/GetPlayerSummaries/v0002/?key=${steam_api_key}&steamids=${steamIds}`,
  );
};

const getSteamPlayerSummaries = async (
  steamIds: Array<string>,
): Promise<Record<string, SteamApiPlayerInterface> | null> => {
  try {
    const response = await axios.get(getSteamPlayerSummariesUrl(steamIds));
    const playersArray = response.data["response"]["players"];
    const playersObject: Record<string, SteamApiPlayerInterface> = {};

    playersArray.forEach((player: SteamApiPlayerInterface) => {
      playersObject[player["steamid"]] = player;
    });

    return playersObject;
  } catch (e) {
    functions.logger.error(`Received data ${JSON.stringify(e)}`);
    return null;
  }
};

export { getSteamPlayerSummaries };

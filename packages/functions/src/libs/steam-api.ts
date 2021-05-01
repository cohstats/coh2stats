import { steam_api_key } from "../config";
import axios from "axios";
import * as functions from "firebase-functions";
import { SteamApiPlayerInterface } from "./types";

const baseUrl = "https://api.steampowered.com/";
const coh2steamAppid = 231430;

const getSteamPlayerSummariesUrl = (steamIds: Array<string>) => {
  return encodeURI(
    `${baseUrl}ISteamUser/GetPlayerSummaries/v0002/?key=${steam_api_key}&steamids=${steamIds}`,
  );
};

const getNumberOfOnlinePlayersSteamUrl = (appId: number | string) => {
  return encodeURI(`${baseUrl}ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`);
};

const getSteamNumberOfOnlinePlayers = async (): Promise<number | null> => {
  try {
    const response = await axios.get(getNumberOfOnlinePlayersSteamUrl(coh2steamAppid));
    return response.data["response"]["player_count"];
  } catch (e) {
    functions.logger.error(`Received data ${JSON.stringify(e)}`);
    return null;
  }
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

export { getSteamPlayerSummaries, getSteamNumberOfOnlinePlayers };

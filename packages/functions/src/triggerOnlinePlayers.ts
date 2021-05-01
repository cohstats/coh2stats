import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getSteamNumberOfOnlinePlayers } from "./libs/steam-api";
import { getOnlinePlayersDocRef } from "./fb-paths";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 540,
  memory: "128MB",
  maxInstances: 1,
};

const triggerNumberOfOnlinePlayers = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async () => {
    let amountOfPlayersOnline = await getSteamNumberOfOnlinePlayers();
    let onlinePlayersRef = getOnlinePlayersDocRef();
    await onlinePlayersRef.set({
      onlinePlayers: amountOfPlayersOnline,
      timeStamp: Math.floor(Date.now() / 1000),
    });

    // 5 minutes wait
    await new Promise((resolve) => setTimeout(resolve, 300000));

    amountOfPlayersOnline = await getSteamNumberOfOnlinePlayers();
    onlinePlayersRef = getOnlinePlayersDocRef();

    await onlinePlayersRef.set({
      onlinePlayers: amountOfPlayersOnline,
      timeStamp: Math.floor(Date.now() / 1000),
    });

    return {};
  });

export { triggerNumberOfOnlinePlayers };

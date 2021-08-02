import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getSteamNumberOfOnlinePlayers } from "./libs/steam-api";
import { getOnlinePlayersDocRef } from "./fb-paths";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 30,
  memory: "128MB",
  maxInstances: 1,
};

const triggerNumberOfOnlinePlayers = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .pubsub.schedule("every 10 mins")
  .timeZone("Etc/UTC")
  .onRun(async () => {
    const amountOfPlayersOnline = await getSteamNumberOfOnlinePlayers();
    const onlinePlayersRef = getOnlinePlayersDocRef();

    if (amountOfPlayersOnline != null && amountOfPlayersOnline > 0) {
      await onlinePlayersRef.set({
        onlinePlayers: amountOfPlayersOnline,
        timeStamp: Math.floor(Date.now() / 1000),
      });
    }
  });

export { triggerNumberOfOnlinePlayers };

import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getPlayerSearchUrl } from "./libs/coh2-api";
import axios from "axios";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 120,
  memory: "128MB",
};

/**
 * This function does a search for the players via relic API
 * {name: "my custom name"}
 *
 * Returns {statsGroups: []}
 */
const searchPlayersOnRelic = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    functions.logger.info(`Received data ${JSON.stringify(data)}`);

    const name = data.name;

    if (!name) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'The function must be called with {name: "Steam Nickname"}',
      );
    }

    const url = getPlayerSearchUrl(name);

    try {
      const response = await axios.get(url);
      const statGroups = response.data["statGroups"];

      return { statGroups };
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError("internal", `Error calling calling the API ${e}`);
    }
  });

export { searchPlayersOnRelic };

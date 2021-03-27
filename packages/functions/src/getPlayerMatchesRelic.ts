import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { getAndPrepareMatchesForPlayer } from "./libs/matches/matches";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 540,
  memory: "128MB",
};

/**
 * This functions get player matches from Relic and directly serves it back without
 * saving the match into the DB.
 * The input data must be in the format:
 * {profileName: "/steam/76561198024016603"}
 */
const getPlayerMatchesFromRelic = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    functions.logger.info(`Received data ${JSON.stringify(data)}`);

    if (!data.profileName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'The function must be called with {profileName: "/steam/76561198024016603"}',
      );
    }

    const playerMatches = await getAndPrepareMatchesForPlayer(data.profileName, false);

    return { playerMatches };
  });

export { getPlayerMatchesFromRelic };

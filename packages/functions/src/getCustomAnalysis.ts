import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { generateCustomMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";


/**
 * We use 512MB to have faster CF in terms of MHz - it executes the requests faster
 */
const runtimeOpts: Record<string, "512MB" | any> = {
  timeoutSeconds: 120,
  memory: "512MB",
};

/**
 * This function is callable with:
 * {startDate: "timestampInMs", endDate: "timestampInMs", type: ""}
 * The TimeStamp is UNIX timestamp
 *
 * Returns the analysis object;
 */
const getCustomAnalysis = functions
  .region(DEFAULT_FUNCTIONS_LOCATION)
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    functions.logger.info(`Custom analysis for settings ${JSON.stringify(data)}`);

    const { startDate, endDate, type } = data;

    if (!startDate || !endDate || !type) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        'The function must be called with {startDate: "", endDate: "", type: ""}',
      );
    }

    try {
      const analysis = await generateCustomMultiDayAnalysis(
        parseInt(startDate) * 1000,
        parseInt(endDate) * 1000,
        type,
      );
      return { analysis, fromTimeStamp: startDate, toTimeStamp: endDate };
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError("internal", `Error calling calling the API ${e}`);
    }
  });

export { getCustomAnalysis };

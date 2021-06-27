import * as functions from "firebase-functions";
import { DEFAULT_FUNCTIONS_LOCATION } from "./constants";
import { generateCustomMultiDayAnalysis } from "./libs/analysis/multi-day-analysis";

const runtimeOpts: Record<string, "128MB" | any> = {
  timeoutSeconds: 120,
  memory: "128MB",
};

/**
 * This function is callable with:
 * {startDate: "timestampInMs", endDate: "timestampInMs", type: ""}
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
      const analysis = await generateCustomMultiDayAnalysis(startDate, endDate, type);
      return { analysis };
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError("internal", `Error calling calling the API ${e}`);
    }
  });

export { getCustomAnalysis };

import { getYesterdayDateTimestamp, isMonday } from "../helpers";
import { runAndSaveMultiDayAnalysis } from "./multi-day-analysis";

/**
 * This functions checks and runs multi-day analysis
 */
const analysisChecker = async () => {
  const date = new Date();
  if (isMonday(date)) {
    await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "week");
  }
};

export { analysisChecker };

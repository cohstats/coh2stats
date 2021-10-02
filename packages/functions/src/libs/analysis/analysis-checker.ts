import { getYesterdayDateTimestamp } from "../helpers";
import { runAndSaveMultiDayAnalysis } from "./multi-day-analysis";

/**
 * This functions checks and runs multi-day analysis
 */
const analysisChecker = async (): Promise<void> => {
  // We want to run aggregation function regardless fo the day in a week
  await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "week");
  await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "week", "top");

  await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "month", "map");
  await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "month");
  await runAndSaveMultiDayAnalysis(new Date(getYesterdayDateTimestamp() * 1000), "month", "top");
};

export { analysisChecker };

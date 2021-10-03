import { filterOnlyAutomatchVsPlayers } from "../../libs/analysis/match-analysis";
import { singleMatchObjectAfterTransform } from "../assets/assets";

describe("filterOnlyAutomatchVsPlayers", () => {
  test("Calculates the time correctly", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    const copiedMatch2 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    const copiedMatch3 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    const copiedMatch4 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch["description"] = "SESSION_ID";
    copiedMatch2["description"] = "PICOVINA";
    copiedMatch3["description"] = "AUTOMATCH";
    copiedMatch4["matchtype_id"] = 22;

    const result = filterOnlyAutomatchVsPlayers([
      copiedMatch,
      copiedMatch2,
      copiedMatch3,
      copiedMatch4,
    ]);
    expect(result.length).toBe(1);
  });
});

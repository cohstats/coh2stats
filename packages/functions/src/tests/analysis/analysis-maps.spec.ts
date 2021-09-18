import { singleMatchObjectAfterTransform } from "../assets/assets";
import { analyzeMatchesByMaps } from "../../libs/analysis/match-map-analysis";

describe("analyzeMatches", () => {
  test("Correctly counts", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch.mapname = "rails_and_metal";
    copiedMatch.maxplayers = 4;

    const matches = [
      singleMatchObjectAfterTransform,
      singleMatchObjectAfterTransform,
      copiedMatch,
    ];

    const result = analyzeMatchesByMaps(matches);

    expect(result["3v3"]["6p_across_the_rhine"].matchCount).toBe(2);
    expect(result["2v2"]["rails_and_metal"].matchCount).toBe(1);
  });

  test("Ignores different result type", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch.mapname = "rails_and_metal";
    copiedMatch.maxplayers = 4;
    copiedMatch.matchhistoryreportresults[0].resulttype = 3;

    const matches = [
      singleMatchObjectAfterTransform,
      singleMatchObjectAfterTransform,
      copiedMatch,
    ];

    const result = analyzeMatchesByMaps(matches);

    expect(result["3v3"]["6p_across_the_rhine"].matchCount).toBe(2);

    expect(result["2v2"]).toStrictEqual({});
  });
});

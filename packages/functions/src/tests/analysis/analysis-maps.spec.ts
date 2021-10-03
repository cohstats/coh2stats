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

  test("Add game time analysis", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    copiedMatch.completiontime = copiedMatch.startgametime + 120;

    const copiedMatch2 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    copiedMatch2.completiontime = copiedMatch2.startgametime + 60 * 7;

    const copiedMatch3 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    copiedMatch3.completiontime = copiedMatch3.startgametime + 60 * 33;

    const copiedMatch4 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    copiedMatch4.completiontime = copiedMatch4.startgametime + 60 * 54;

    const copiedMatch5 = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));
    copiedMatch5.completiontime = copiedMatch5.startgametime + 60 * 120;

    const result = analyzeMatchesByMaps([
      copiedMatch,
      copiedMatch3,
      copiedMatch4,
      copiedMatch5,
      copiedMatch2,
      copiedMatch2,
      singleMatchObjectAfterTransform,
    ]);

    expect(result["3v3"]["6p_across_the_rhine"]["gameTimeSpread"]).toStrictEqual({
      "0": 1,
      "5": 2,
      "10": 0,
      "20": 0,
      "30": 1,
      "40": 1,
      "50": 1,
      "60": 1,
    });
  });
});

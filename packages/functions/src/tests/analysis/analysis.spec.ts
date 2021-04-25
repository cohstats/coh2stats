import { analyzeMatches, analyzeTopMatches } from "../../libs/analysis/match-analysis";
import { singleMatchObjectAfterTransform } from "../assets/assets";

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

    const result = analyzeMatches(matches);

    expect(result["3v3"].matchCount).toBe(2);

    expect(result["2v2"].matchCount).toBe(1);
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

    const result = analyzeMatches(matches);

    expect(result["3v3"].matchCount).toBe(2);

    expect(result["2v2"].matchCount).toBe(undefined);
  });
});

describe("analyzeTopMatches", () => {
  test("Ignores 2v2 because players are not in the ladders", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch.mapname = "rails_and_metal";
    copiedMatch.maxplayers = 4;

    const matches = [
      singleMatchObjectAfterTransform,
      singleMatchObjectAfterTransform,
      copiedMatch,
    ];

    const ladderIds = {
      "1v1": [], //string is in the format of just number  ( does not include /steam/)
      "2v2": [],
      "3v3": [
        "76561197964852677",
        "76561198019031541",
        "76561198272558420",
        "76561198018329331",
        "76561198354099947",
        "76561198034318060",
      ],
      "4v4": [],
    };

    const result = analyzeTopMatches(matches, ladderIds);

    expect(result["3v3"].matchCount).toBe(2);
    expect(result["2v2"].matchCount).toBe(undefined);
  });

  test("Ignores 2v2 because 1 player is not in the ladders", () => {
    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch.mapname = "rails_and_metal";
    copiedMatch.maxplayers = 4;

    const matches = [
      singleMatchObjectAfterTransform,
      singleMatchObjectAfterTransform,
      copiedMatch,
    ];

    const ladderIds = {
      "1v1": [], //string is in the format of just number  ( does not include /steam/)
      "2v2": [
        "76561197964852677",
        "76561198019031541",
        "76561198272558420",
        "76561198018329331",
        "76561198354099947",
        "76561198034318060",
      ],
      "3v3": [
        "76561197964852677",
        "76561198019031541",
        "76561198272558420",
        "76561198018329XXX",
        "76561198354099947",
        "76561198034318060",
      ],
      "4v4": [],
    };

    const result = analyzeTopMatches(matches, ladderIds);

    expect(result["3v3"].matchCount).toBe(undefined);
    expect(result["2v2"].matchCount).toBe(1);
  });
});

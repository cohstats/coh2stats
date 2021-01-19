import { analyzeMatches } from "../../libs/analysis/analysis";
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

        //console.log(result)
    });
});

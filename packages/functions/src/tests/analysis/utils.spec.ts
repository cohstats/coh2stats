import { calculateGameTime } from "../../libs/analysis/utils";
import { singleMatchObjectAfterTransform } from "../assets/assets";

describe("calculateGameTime", () => {
  test("Calculates the time correctly", () => {
    const timeInSeconds = calculateGameTime(singleMatchObjectAfterTransform);

    expect(timeInSeconds).toBe(2475);
  });
});

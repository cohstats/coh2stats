import { getDefaultSliderPosition } from "../../utils/charts-utils";

describe("getDefaultSliderPosition", () => {
  test("min width 0.1", () => {
    const result = getDefaultSliderPosition(1000, 10);
    expect(result).toMatchObject({ start: 0.9, end: 1 });
  });

  test("max is full width", () => {
    const result = getDefaultSliderPosition(100, 100);
    expect(result).toMatchObject({ start: 0, end: 1 });
  });

  test("half width", () => {
    const result = getDefaultSliderPosition(100, 50);
    expect(result).toMatchObject({ start: 0.5, end: 1 });
  });
});

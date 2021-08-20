import { getCurrentPatch, isTimeStampInPatches } from "../../coh/patches";

describe("isTimeStampInPatches", () => {
  test("Returns winter patch", () => {
    const result = isTimeStampInPatches(1614299600);
    expect(result[0].name).toBe("Winter Balance Patch 2021");
  });
});

describe("getCurrentPatch", () => {
  test("Returns the current patch", () => {
    const result = getCurrentPatch();
    expect(result.endDateUnixTimeStamp).toBe(Infinity);
  });
});

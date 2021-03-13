import { extractTheProfileIDs } from "../libs/ladder-data";
import { laddersDataObject } from "./assets/assets";

describe("extractTheProfileIDs", () => {
  test("Returns set of 10 items", async () => {
    const result = extractTheProfileIDs(laddersDataObject);
    expect(result.size).toBe(10);
  });
});

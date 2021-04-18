import { extractTheProfileIDs } from "../libs/ladder-data";
import { laddersDataObject } from "./assets/assets";

xdescribe("extractTheProfileIDs", () => {
  xtest("Returns set of 10 items", async () => {
    const result = extractTheProfileIDs(laddersDataObject);
    expect(result.size).toBe(10);
  });
});

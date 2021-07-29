import { laddersDataObject } from "../../assets/assets";
import { findAndMergeStatGroups } from "../../../coh/helpers";

describe("findAndMergeStatGroups", () => {
  test("Creates correct array", () => {
    const resultArray = findAndMergeStatGroups(laddersDataObject, laddersDataObject);
    expect(resultArray).toHaveLength(200);
    expect(resultArray[0]["members"]).toHaveLength(2);
  });
});

export {};

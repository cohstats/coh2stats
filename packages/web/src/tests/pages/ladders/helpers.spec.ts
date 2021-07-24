import { findAndMergeStatGroups } from "../../../pages/ladders/helpers";
import { laddersDataObject } from "../../assets/assets";

describe("findAndMergeStatGroups", () => {
  test("Creates correct array", () => {
    const resultArray = findAndMergeStatGroups(laddersDataObject);
    expect(resultArray).toHaveLength(200);
    expect(resultArray[0]["members"]).toHaveLength(2);
  });
});

export {};

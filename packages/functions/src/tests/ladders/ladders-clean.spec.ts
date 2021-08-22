import { cleanLaddersData } from "../../libs/ladders/ladders-clean";
import { laddersDataObject } from "../assets/assets";

describe("cleanLaddersData", () => {
  it("Properly cleans the ladder object", () => {
    const copyData = JSON.parse(JSON.stringify(laddersDataObject));
    const fixedData = cleanLaddersData(copyData);

    expect(fixedData.statGroups[0].members[0].level).toBe(300);
    expect(fixedData.leaderboardStats[0].leaderboard_id).toBe(6);
  });
});

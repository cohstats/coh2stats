import { cleanLaddersData } from "../../libs/ladders/ladders-clean";
import { laddersDataObject } from "../assets/assets";

describe("cleanLaddersData", () => {
  it("Properly cleans the ladder object", () => {
    const copyData = JSON.parse(JSON.stringify(laddersDataObject));

    for (const ladderRank of copyData.leaderboardStats) {
      expect(typeof ladderRank.regionRank).toBe("number");
      expect(typeof ladderRank.rankTotal).toBe("number");
      expect(typeof ladderRank.regionRankTotal).toBe("number");
    }

    const fixedData = cleanLaddersData(copyData);

    expect(fixedData.statGroups[0].members[0].level).toBe(300);
    expect(fixedData.leaderboardStats[0].leaderboard_id).toBe(6);

    for (const ladderRank of fixedData.leaderboardStats) {
      expect(ladderRank.regionRank).toBe(undefined);
      expect(ladderRank.rankTotal).toBe(undefined);
      expect(ladderRank.regionRankTotal).toBe(undefined);
    }
  });
});

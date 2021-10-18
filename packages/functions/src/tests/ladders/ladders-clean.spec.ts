import { cleanLaddersData } from "../../libs/ladders/ladders-clean";
import { laddersDataObject } from "../assets/assets";

describe("cleanLaddersData", () => {
  it("Properly cleans the ladder object", () => {
    const copyData = JSON.parse(JSON.stringify(laddersDataObject));

    for (const ladderRank of copyData.leaderboardStats) {
      expect(typeof ladderRank.regionrank).toBe("number");
      expect(typeof ladderRank.ranktotal).toBe("number");
      expect(typeof ladderRank.regionranktotal).toBe("number");
    }

    const fixedData = cleanLaddersData(copyData);

    expect(fixedData.statGroups[0].members[0].level).toBe(300);
    expect(fixedData.leaderboardStats[0].leaderboard_id).toBe(16);

    for (const ladderRank of fixedData.leaderboardStats) {
      expect(ladderRank.regionrank).toBe(undefined);
      expect(ladderRank.ranktotal).toBe(undefined);
      expect(ladderRank.regionranktotal).toBe(undefined);
    }
  });
});

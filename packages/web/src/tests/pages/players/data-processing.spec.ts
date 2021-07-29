import {
  findByLeaderBoardID,
  prepareLeaderBoardDataForSinglePlayer,
} from "../../../pages/players/data-processing";
import { relicProfile } from "../../assets/relic-profile";

describe("prepareLeaderBoardData", () => {
  test("Generates the stuff", () => {
    const result = prepareLeaderBoardDataForSinglePlayer(relicProfile.leaderboardStats);

    expect(result.finalStatsSingleGame["usf"][0]["leaderboard_id"]).toBe(7);
    expect(result.finalStatsSingleGame["wgerman"][0]["leaderboard_id"]).toBe(6);

    expect(result.finalStatsTeamGames["axis"].length).toBe(14);
    expect(result.finalStatsTeamGames["allies"].length).toBe(17);
  });
});

describe("findByLeaderBoardID", () => {
  test("Finds the british", () => {
    const result = findByLeaderBoardID(52);

    expect(result.mode).toBe("2v2");
    expect(result.race).toBe("british");
  });

  test("Finds the usf", () => {
    const result = findByLeaderBoardID(19);

    expect(result.mode).toBe("4v4");
    expect(result.race).toBe("usf");
  });

  test("Finds the team matches", () => {
    const result = findByLeaderBoardID(20);

    expect(result.mode).toBe("team2");
    expect(result.race).toBe("axis");
  });
});

export {};

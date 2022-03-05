import {
  baseUrl,
  getCommanderRace,
  getIntelBulletinRace,
  getMultipleRecentMatchHistoryUrl,
} from "../libs/coh2-api";

describe("getCommanderRace", () => {
  test("Returns correct race for commander ID", async () => {
    expect(getCommanderRace(7539)).toBe("wermacht");
  });

  test("Returns unknown race for unknown ID", async () => {
    expect(getCommanderRace(11111111)).toBe("unknown");
  });
});

describe("getIntelBulletinRace", () => {
  test("Returns correct race array for bulletin ID", async () => {
    expect(getIntelBulletinRace(5857)).toStrictEqual(["wermacht", "soviet"]);
  });

  test("Returns unknown race for unknown ID", async () => {
    expect(getIntelBulletinRace(11111111)).toStrictEqual([]);
  });
});

describe("getMultipleRecentMatchHistoryUrl", () => {
  test("Returns correct string", () => {
    const result = getMultipleRecentMatchHistoryUrl([
      "/steam/76561198050674754",
      "/steam/76561198079451829",
      "/steam/76561198351585062",
    ]);
    expect(result).toMatch(
      `${baseUrl}/community/leaderboard/getRecentMatchHistory?title=coh2&profile_names=%5B%22/steam/76561198050674754%22,%22/steam/76561198079451829%22,%22/steam/76561198351585062%22%5D`,
    );
  });

  test("Returns correct string for single", () => {
    const result = getMultipleRecentMatchHistoryUrl(["/steam/76561198050674754"]);
    expect(result).toMatch(
      `${baseUrl}/community/leaderboard/getRecentMatchHistory?title=coh2&profile_names=%5B%22/steam/76561198050674754%22%5D`,
    );
  });
});

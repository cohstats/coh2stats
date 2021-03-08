import { getCommanderRace } from "../libs/coh2-api";

describe("getCommanderRace", () => {
    test("Returns correct race for commander ID", async () => {
        expect(getCommanderRace(7539)).toBe("wermacht");
    });

    test("Returns unknown race for unknown ID", async () => {
        expect(getCommanderRace(11111111)).toBe("unknown");
    });
});

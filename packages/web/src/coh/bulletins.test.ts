import { searchBulletins } from "./bulletins";

describe("Search Bulletins Function test", () => {
  test("Finds at most 1 bulleting by the bulletin name", () => {
    const searchQuery = "Sitting Ducks";
    const found = searchBulletins(searchQuery);
    expect(found).toHaveLength(1);
  });
  test("Finds at least 1 bulletin by the bulletin short description", () => {
    const searchQuery = "rockets have 4% increased penetration";
    const found = searchBulletins(searchQuery);
    expect(found).toHaveLength(1);
  });

  test("Find more than 1 bulletin by bulletin name", () => {
    const searchQuery = "BM-13";
    const found = searchBulletins(searchQuery);
    expect(
      found.find((commander: any) => commander["bulletinName"] === "Missiles Everywhere!"),
    ).toBeTruthy();
    expect(
      found.find((commander: any) => commander["bulletinName"] === "Artillery Production I"),
    ).toBeTruthy();
  });

  test("Find none", () => {
    const searchQuery = "notfound";
    const found = searchBulletins(searchQuery);
    expect(found).toHaveLength(0);
  });
});

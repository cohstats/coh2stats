import { searchCommanders } from "./commanders";

describe("Search Commanders Function test", () => {
  test("Finds at most 1 commander with full name", () => {
      const searchQuery = "Airborne Company";
      const foundCommanders = searchCommanders(searchQuery);
      expect(foundCommanders).toHaveLength(1);
  });
  test("Finds 9 commanders with a generic commander ", () => {
    const searchQuery = "Company";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders).toHaveLength(9);
  });

  test("Find at least 1 commander per commander ability", () => {
    const searchQuery = "Target Artillery";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders.find((commander:any) => commander["commanderName"] == "Infantry Company")).toBeTruthy();
  });

  test("Find none", () => {
    const searchQuery = "notfound";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders).toHaveLength(0);
  });
});

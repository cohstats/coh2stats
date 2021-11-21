import { getCommanderByRaces, getCommanderData, searchCommanders } from "./commanders";

describe("Search Commanders Function test", () => {
  test("Finds at least 1 commander with full name", () => {
    const searchQuery = "Airborne Company";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders.length).toBeGreaterThan(0);
  });
  test("Finds more than 1 commanders with a generic commander", () => {
    const searchQuery = "Company";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders.length).toBeGreaterThan(1);
  });

  test("Find at least 1 commander per commander ability", () => {
    const searchQuery = "Target Artillery";
    const foundCommanders = searchCommanders(searchQuery);
    expect(
      foundCommanders.find((commander: any) => commander["commanderName"] === "Infantry Company"),
    ).toBeTruthy();
  });

  test("Find none", () => {
    const searchQuery = "notfound";
    const foundCommanders = searchCommanders(searchQuery);
    expect(foundCommanders).toHaveLength(0);
  });
});

describe("getCommanderData", () => {
  test("Returns a Commander when commanderId is correct", () => {
    const commander = getCommanderData("186413");
    expect(commander).not.toBeNull();
  });

  test("Returns null when commanderId is not correct", () => {
    const commander = getCommanderData("0000000");
    expect(commander).toBeNull();
  });

  test("Returns a commander with sorted abilities according to command points", () => {
    const commander = getCommanderData("186413");
    const expectedAbilitiesNames = [
      "Pathfinders",
      "Paradrop .50cal M2HB Heavy Machine Gun",
      "Paratroopers",
      "Paradrop M1 57mm Anti-Tank Gun",
      "P-47 Rocket Strike",
    ];
    expect(commander?.abilities.map((ability) => ability.name)).toEqual(expectedAbilitiesNames);
  });
});

describe("getCommanderByRaces", () => {
  test("Returns a list of commanders when race is correct", () => {
    const commanders = getCommanderByRaces("wermacht");
    expect(commanders).toHaveLength(23);
  });

  test("Returns a list of commanders with abilities being sorted", () => {
    const commanders = getCommanderByRaces("wermacht");
    commanders
      .map((commander) => commander.abilities)
      .forEach((abilities) => {
        let expectedCommandPoints = abilities
          .map((ability) => ability.commandPoints)
          .sort((c1, c2) => +c1 - +c2);
        expect(abilities.map((ability) => ability.commandPoints)).toEqual(expectedCommandPoints);
      });
  });
});

import * as testHelper from "./test-helpers";
import {
  convertCommanderIDToName,
  getCommanderData,
  getCommanderByRaces,
  getCommanderIconPath,
  searchCommanders,
} from "../../coh/commanders";
import { RaceName } from "../../coh/types";
import * as data from "../../coh/data/cu2021/commanderData.json";

describe("convertCommanderIDToName", () => {
  test("Returns commanderID when commanderID not in commanderData", () => {
    const testId: string = "random string for testing";
    const actual = convertCommanderIDToName(testId);
    expect(actual).toEqual(testId);
  });

  test("Returns commanderName when in commanderData", () => {
    const testElement = testHelper.getRandomElement(data);
    const actual = convertCommanderIDToName(testElement.serverID);
    expect(actual).toEqual(testElement.commanderName);
  });
});

describe("getCommanderData", () => {
  test("Returns null when bulletinID not in commanderData", () => {
    const testId: string = "random string for testing";
    const actual = getCommanderData(testId);
    expect(actual).toBeNull();
  });

  test("Returns commanderData when bulletinID in commanderData", () => {
    const testElement = testHelper.getRandomElement(data);
    const actual = getCommanderData(testElement.serverID);
    expect(actual).toEqual(testElement);
  });

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
  test("Returns filled Array when raceName in commanderData", () => {
    const testName: RaceName = "usf";
    const actual = getCommanderByRaces(testName);
    expect(actual.length).toBeGreaterThan(0);
  });

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

describe("getCommanderIconPath", () => {
  test("Returns correct resource path", () => {
    const testName = "test-name";
    const actual = getCommanderIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });

  test("Handles empty strings", () => {
    const testName = " ";
    const actual = getCommanderIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });
});

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
    const foundCommanders = searchCommanders(searchQuery, true);
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

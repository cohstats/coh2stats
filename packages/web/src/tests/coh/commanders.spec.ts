import * as testHelper from './test-helpers';
import {
  convertCommanderIDToName,
  getCommanderData,
  getCommanderByRaces,
  getCommanderIconPath
} from "../../coh/commanders";
import { RaceName } from "../../coh/types";
import * as data from "../../coh/data/cu2021/commanderData.json";

describe("convertCommanderIDToName", () => {
  test("Returns commanderID when commanderID not in commanderData", () => {
    const testId: string = 'random string for testing';
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
    const testId: string = 'random string for testing';
    const actual = getCommanderData(testId);
    expect(actual).toBeNull();
  });

  test("Returns commanderData when bulletinID in commanderData", () => {
    const testElement = testHelper.getRandomElement(data);
    const actual = getCommanderData(testElement.serverID);
    expect(actual).toEqual(testElement);
  });
});

describe("getCommanderByRaces", () => {
  test("Returns filled Array when raceName in commanderData", () => {
    const testName: RaceName = 'usf';
    const actual = getCommanderByRaces(testName);
    expect(actual.length).toBeGreaterThan(0);
  });
});

describe("getCommanderIconPath", () => {
  test("Returns correct resource path", () => {
    const testName = 'test-name';
    const actual = getCommanderIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });

  test("Handles empty strings", () => {
    const testName = ' ';
    const actual = getCommanderIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });
});

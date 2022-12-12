import * as testHelper from "./test-helpers";
import {
  convertBulletinIDToName,
  getBulletinData,
  getBulletinsByRaces,
  getAllBulletins,
  getBulletinIconPath,
  
} from "../../coh/bulletins";
import { RaceName } from "../../coh/types";
import * as data from "../../coh/data/cu2021/bulletinData.json";

describe("convertBulletinIDToName", () => {
  test("Returns bulletinID when bulletinID not in bulletinsData", () => {
    const testId: string = "random string for testing";
    const actual = convertBulletinIDToName(testId);
    expect(actual).toEqual(testId);
  });

  test("Returns bulletinName when in bulletinsData", () => {
    const testElement = testHelper.getRandomElement(data);
    const actual = convertBulletinIDToName(testElement.serverID);
    expect(actual).toEqual(testElement.bulletinName);
  });
});

describe("getBulletinData", () => {
  test("Returns null when bulletinID not in bulletinsData", () => {
    const testId: string = "random string for testing";
    const actual = getBulletinData(testId);
    expect(actual).toBeNull();
  });

  test("Returns bulletinsData when bulletinID in bulletinsData", () => {
    const testElement = testHelper.getRandomElement(data);
    const actual = getBulletinData(testElement.serverID);
    expect(actual).toEqual(testElement);
  });
});

describe("getBulletinsByRaces", () => {
  test("Returns filled Array when raceName in bulletinData", () => {
    const testName: RaceName = "british";
    const actual = getBulletinsByRaces(testName);
    expect(actual.length).toBeGreaterThan(0);
  });
});

describe("getAllBulletins", () => {
  test("Returns filled Array", () => {
    const actual = getAllBulletins();
    expect(actual.length).toEqual(testHelper.getDataCount(data));
  });
});

describe("getBulletinIconPath", () => {
  test("Returns correct resource path", () => {
    const testName = "test-name";
    const actual = getBulletinIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });

  test("Handles empty strings", () => {
    const testName = " ";
    const actual = getBulletinIconPath(testName);
    expect(actual).toEqual(`/resources/exportedIcons/${testName}.png`);
  });
});

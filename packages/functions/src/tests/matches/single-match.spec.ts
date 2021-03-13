import {
  filterOutItems,
  removeExtraDataFromItems,
  processSingleMatch,
  extractPlayerIDsInMatch,
  findProfile,
  isLastDayMatch,
} from "../../libs/matches/single-match";

import { getHoursOldTimestamp } from "../../libs/helpers";

import { singleMatchObjectFromAPI, profilesArray } from "../assets/assets";

const verifyMatchHistoryItems = (matchObject: Record<string, any>) => {
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("durabilitytype", undefined);
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("durability", undefined);
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("metadata", undefined);
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("matchhistory_id", undefined);

  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("itemdefinition_id");
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("itemlocation_id");
  expect(matchObject["matchhistoryitems"][0]).toHaveProperty("profile_id");
};

describe("filterOutItems", () => {
  test("Items are filtered", () => {
    const clonedObject = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));

    expect(clonedObject["matchhistoryitems"].length).toBe(33);
    const modifiedObject = filterOutItems(clonedObject);
    expect(modifiedObject["matchhistoryitems"].length).toBe(24);
  });
});

describe("removeExtraDataFromItems", () => {
  /* eslint-disable jest/expect-expect */
  // Verification is done in the function ^^
  test("Unnecessary properties from items are removed", () => {
    const clonedObject = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));
    removeExtraDataFromItems(clonedObject);

    verifyMatchHistoryItems(clonedObject);
  });
});

describe("processSingleMatch", () => {
  test("Unnecessary items are removed, items are filtered and cleared", () => {
    let clonedSingleMatch = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));
    clonedSingleMatch = processSingleMatch(clonedSingleMatch);

    expect(clonedSingleMatch["matchhistoryitems"].length).toBe(24);
    verifyMatchHistoryItems(clonedSingleMatch);

    expect(clonedSingleMatch).toHaveProperty("options", undefined);
    expect(clonedSingleMatch).toHaveProperty("slotinfo", undefined);
    expect(clonedSingleMatch).toHaveProperty("observertotal", undefined);
    expect(clonedSingleMatch).toHaveProperty("matchurls", undefined);

    expect(clonedSingleMatch).toHaveProperty("mapname");
    expect(clonedSingleMatch).toHaveProperty("description");
    expect(clonedSingleMatch).toHaveProperty("startgametime");
    // There is more things we could check
  });
});

describe("extractPlayerIDsInMatch", () => {
  test("IDs are extracted", () => {
    const clonedSingleMatch = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));
    const ids = extractPlayerIDsInMatch(clonedSingleMatch);
    expect(ids).toEqual([1882602, 2604692, 3036689, 3793687]);
  });
});

describe("findProfile", () => {
  test("Can find the profile", () => {
    const profile = findProfile(1882602, profilesArray);
    expect(profile).toMatchObject({
      profile_id: 1882602,
      name: "/steam/76561198018329331",
      alias: "Ramp",
      personal_statgroup_id: 2388240,
      xp: 2711300,
      level: 71,
      leaderboardregion_id: 0,
      country: "cz",
    });
  });
});

describe("isLastDayMatch", () => {
  test("The match is not in the last day", () => {
    expect(isLastDayMatch(singleMatchObjectFromAPI)).toBeFalsy();
  });

  test("The match is not in the last day after 26 hours", () => {
    const clonedSingleMatch = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));
    clonedSingleMatch["startgametime"] = getHoursOldTimestamp(26);

    expect(isLastDayMatch(clonedSingleMatch)).toBeFalsy();
  });

  test("The match is in the last day", () => {
    const clonedSingleMatch = JSON.parse(JSON.stringify(singleMatchObjectFromAPI));
    clonedSingleMatch["startgametime"] = getHoursOldTimestamp(24);

    expect(isLastDayMatch(clonedSingleMatch)).toBeTruthy();

    clonedSingleMatch["startgametime"] = getHoursOldTimestamp(1);

    expect(isLastDayMatch(clonedSingleMatch)).toBeTruthy();
  });
});

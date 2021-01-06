import {filterOutItems, removeExtraDataFromItems, processSingleMatch} from "../libs/matches/coh2-matches";
import {singleMatchObject} from "./assets/assets";

const verifyMatchHistoryItems = (matchObject: Record<string, any>) => {
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("durabilitytype", undefined);
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("durability", undefined);
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("metadata", undefined);
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("matchhistory_id", undefined);

    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("itemdefinition_id");
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("itemlocation_id");
    expect(matchObject["matchhistoryitems"][0]).toHaveProperty("profile_id");
}

describe("filterOutItems", () => {

    test('Items are filtered', () => {
        const clonedObject = JSON.parse(JSON.stringify(singleMatchObject));

        expect(clonedObject["matchhistoryitems"].length).toBe(33);
        const modifiedObject = filterOutItems(clonedObject);
        expect(modifiedObject["matchhistoryitems"].length).toBe(24);
    })

})


describe("removeExtraDataFromItems", () => {

    test("Unnecessary properties from items are removed", () => {
        const clonedObject = JSON.parse(JSON.stringify(singleMatchObject));
        removeExtraDataFromItems(clonedObject);

        verifyMatchHistoryItems(clonedObject);

    })

})


describe("processSingleMatch", () =>{

    test("Unnecessary items are removed, items are filtered and cleared", () =>{
        let clonedSingleMatch = JSON.parse(JSON.stringify(singleMatchObject));
        clonedSingleMatch = processSingleMatch(clonedSingleMatch)

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

    })

})


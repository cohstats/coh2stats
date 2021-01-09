import {
    getAndPrepareMatches
} from "../../libs/matches/matches";

describe("getAndPrepareMatches", () => {

    // This tests makes live API call, so keep it disabled
    xtest("It works - debugging purposes", async () => {

        await getAndPrepareMatches("/steam/76561198034318060")

        // result.forEach(result => {
        //     console.log(result.matchhistoryreportresults[0].profile)
        // })

    })

})
import {
    getAndPrepareMatchesForPlayer
} from "../../libs/matches/matches";


describe("getAndPrepareMatches", () => {

    // This tests makes live API call, so keep it disabled
    xtest("It works - debugging purposes", async () => {

        let result;
        result = await getAndPrepareMatchesForPlayer("/steam/76561198034318060")

        console.log(result[0])


        result[0].matchhistoryreportresults.forEach(result => {
            console.log(result)
        })

    })

})

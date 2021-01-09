import {
    convertSteamNameToID
} from "../libs/helpers";


describe("convertSteamNameToID", () => {

    test("Is correctly converted", () => {
        const steamName = "/steam/76561198131099369";
        const id = convertSteamNameToID(steamName);

        expect(id).toBe("76561198131099369");
    })

})
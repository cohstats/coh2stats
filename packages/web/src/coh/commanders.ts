import * as allCommandersJSON from "./data/commanderData.json";
const allCommanders: Record<string, any> = (allCommandersJSON as Record<string, any>)["default"];

const convertCommanderIDToName = (commanderID: number): string => {
    if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
        return allCommanders[commanderID]["commanderName"];
    } else {
        // In case we don't know the commander number
        return `${commanderID}`;
    }
};

const getCommanderData = (commanderID: string): Record<string, any> => {
    if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
        return allCommanders[commanderID];
    } else {
        return {};
    }
};

const getCommanderByRaces = (
    raceName: "wermacht" | "usf" | "soviet" | "wgerman" | "british",
): Array<Record<string, any>> => {
    return Object.values(allCommanders).filter((commanderData) => {
        return commanderData["races"][0] == raceName;
    });
};

export { convertCommanderIDToName, getCommanderData, getCommanderByRaces };

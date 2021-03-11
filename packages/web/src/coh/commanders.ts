import * as allCommandersJSON from "./data/commanderData.json";
import { CommanderData, RaceName } from "./types";
const allCommanders: Record<string, any> = (allCommandersJSON as Record<string, any>)["default"];

const convertCommanderIDToName = (commanderID: string): string => {
    if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
        return allCommanders[commanderID]["commanderName"];
    } else {
        // In case we don't know the commander number
        return `${commanderID}`;
    }
};

const getCommanderData = (commanderID: string): CommanderData | null => {
    if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
        return allCommanders[commanderID];
    } else {
        return null;
    }
};

const getCommanderByRaces = (raceName: RaceName): Array<CommanderData> => {
    return Object.values(allCommanders).filter((commanderData) => {
        return commanderData["races"][0] == raceName;
    });
};

export { convertCommanderIDToName, getCommanderData, getCommanderByRaces };

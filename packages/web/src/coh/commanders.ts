import * as allCommandersJSON from "./data/wbp2021/commanderData.json";
import { CommanderData, RaceName } from "./types";
const objectScan = require('object-scan');
const allCommanders: Record<string, any> = (allCommandersJSON as Record<string, any>)["default"];

const searchCommanders = (search: string): any => {

  Object.values(allCommanders).filter((commanderData) => {
        
    const evalPerName:boolean = commanderData["commanderName"].toLowerCase().matches(/${search}/);

    const evalPerAbility = commanderData["abilities"].find((ability:any) => {
      const lowerCaseAbilityName = ability["name"].toLowerCase()
      return lowerCaseAbilityName.matches(/${search}/);
    });

    
  });
  
};

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
    return commanderData["races"][0] === raceName;
  });
};

const getCommanderIconPath = (name: string): string => {
  return `/resources/exportedIcons/${name}.png`;
};

export { convertCommanderIDToName, getCommanderData, getCommanderByRaces, getCommanderIconPath, searchCommanders };

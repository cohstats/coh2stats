import * as bulletinIDsToRacesJSON from "./data/cu2021/bulletinData.json";
import { IntelBulletinData, RaceName } from "./types";

const bulletinsData: Record<string, any> = (bulletinIDsToRacesJSON as Record<string, any>)[
  "default"
];

const searchBulletins = (search: string): Array<IntelBulletinData> => {
  const searchRegExp = new RegExp(search.toLowerCase(), 'g');
  const foundBulletins = Object.values(bulletinsData).filter((bulletinData) => {
    const evalPerName: boolean = bulletinData["bulletinName"]
      .toLowerCase()
      .match(searchRegExp) != null;
    const evalPerDescription: boolean = bulletinData["descriptionShort"]
    .toLowerCase()
    .match(searchRegExp) != null;    
    return evalPerDescription || evalPerName;
  });
  return foundBulletins;
};

const convertBulletinIDToName = (bulletinID: string): string => {
  if (Object.prototype.hasOwnProperty.call(bulletinsData, bulletinID)) {
    return bulletinsData[bulletinID]["bulletinName"];
  } else {
    // In case we don't know the commander number
    return `${bulletinID}`;
  }
};

const getBulletinData = (bulletinID: string): IntelBulletinData | null => {
  if (Object.prototype.hasOwnProperty.call(bulletinsData, bulletinID)) {
    return bulletinsData[bulletinID];
  } else {
    return null;
  }
};

const getBulletinsByRaces = (raceName: RaceName): Array<IntelBulletinData> => {
  return Object.values(bulletinsData).filter((bulletinData) => {
    return bulletinData["races"].includes(raceName);
  });
};

const getAllBulletins = (): Array<IntelBulletinData> => {
  return Object.values(bulletinsData);
};

const getBulletinIconPath = (name: string): string => {
  return `/resources/exportedIcons/${name}.png`;
};

export {
  convertBulletinIDToName,
  getBulletinData,
  getBulletinsByRaces,
  getAllBulletins,
  getBulletinIconPath,
  searchBulletins,
};

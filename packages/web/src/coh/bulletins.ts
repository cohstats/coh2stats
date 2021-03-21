import * as bulletinIDsToRacesJSON from "./data/bulletinData.json";
import { IntelBulletinData, RaceName } from "./types";

const bulletinsData: Record<string, any> = (bulletinIDsToRacesJSON as Record<string, any>)[
  "default"
];

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

export { convertBulletinIDToName, getBulletinData, getBulletinsByRaces, getAllBulletins };

interface CommanderData {
  serverID: string;
  iconSmall: string;
  iconlarge: string;
  commanderName: string;
  description: string;
  races: Array<string>;
  abilities: Array<Record<string, any>>;
}

interface IntelBulletinData {
  serverID: string;
  bulletinName: string;
  descriptionShort: string;
  descriptionLong: string;
  icon : string;
  races: Array<string>;
}

type RaceName = "wermacht" | "usf" | "soviet" | "wgerman" | "british";
const validRaceNames = ["wermacht", "usf", "soviet", "wgerman", "british"];

const validStatsTypes = ["1v1", "2v2", "3v3", "4v4", "general"];

export type { CommanderData, IntelBulletinData, RaceName };
export { validRaceNames, validStatsTypes };

interface CommanderData {
  serverID: string;
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
  races: Array<string>;
}

type RaceName = "wermacht" | "usf" | "soviet" | "wgerman" | "british";

export type { CommanderData, IntelBulletinData, RaceName };

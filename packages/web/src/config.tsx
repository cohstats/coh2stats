export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
  storageBucket: string;
}

/**
 * Get current firebase config
 */
const firebase = (): FirebaseConfig => {
  // Next.js uses NEXT_PUBLIC_ prefix for client-side env vars
  const configString =
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG || process.env.REACT_APP_FIREBASE_CONFIG || "{}";
  return JSON.parse(configString);
};

const firebaseFunctions = {
  location: "us-east4",
};

const devHostnames = ["localhost", "coh2-ladders-dev.web.app"];

const config = {
  firebase,
  firebaseFunctions,
  devHostnames,
  discordInviteLink: "https://discord.gg/4Bj2y84WAR",
  donationLink: "https://ko-fi.com/cohstats",
  coh2steamGameId: 231430,
  apiUrl: `https://${firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/`,
  // this is just for info
  matchAreStoredForDays: 30,
  scrapeFrequencyMinutes: 5,
  defaultTimeoutRequestMs: 30000,
  DesktopAppVersionFile: {
    version: "1.5.15",
    link: "https://github.com/cohstats/coh2stats/releases/tag/v1.5.15",
    downloadLink:
      "https://github.com/cohstats/coh2stats/releases/download/v1.5.15/Coh2.Game.Stats-1.5.15.Setup.exe",
  },
};

// The date when we exported the data for the bulletins and commanders
export const commanderAndBulletinDate = "10th September 2021";
export const lastPatchName = "Summer Balance Patch 2021";

export default config;

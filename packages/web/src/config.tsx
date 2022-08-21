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
const firebase = (): FirebaseConfig => JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || "{}");

const firebaseFunctions = {
  location: "us-east4",
};

const discordInviteLink = "https://discord.gg/jRrnwqMfkr";

const devHostnames = ["localhost", "coh2-ladders-dev.web.app"];

const config = {
  firebase,
  firebaseFunctions,
  devHostnames,
  discordInviteLink,
  donationLink: "https://ko-fi.com/cohstats",
  coh2steamGameId: 231430,
  // this is just for info
  matchAreStoredForDays: 14,
  scrapeFrequencyMinutes: 5,
};

// The date when we exported the data for the bulletins and commanders
export const commanderAndBulletinDate = "10th September 2021";
export const lastPatchName = "Summer Balance Patch 2021";

export default config;

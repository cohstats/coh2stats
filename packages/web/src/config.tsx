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

const devHostnames = ["localhost", "coh2-ladders-dev.web.app"];

const config = {
  firebase,
  firebaseFunctions,
  devHostnames,
  discordInviteLink: "https://discord.gg/jRrnwqMfkr",
  donationLink: "https://ko-fi.com/cohstats",
  coh2steamGameId: 231430,
  api: {
    gcp: `https://${firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/`,
    cf: "https://coh2stats.com/api-cf/",
  },
  // this is just for info
  matchAreStoredForDays: 30,
  scrapeFrequencyMinutes: 5,
};

// The date when we exported the data for the bulletins and commanders
export const commanderAndBulletinDate = "10th September 2021";
export const lastPatchName = "Summer Balance Patch 2021";

export default config;

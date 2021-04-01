import type { ReactReduxFirebaseConfig } from "react-redux-firebase";
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

const rrfConfig: Partial<ReactReduxFirebaseConfig> = {
  enableLogging: true,
  userProfile: "users",
  useFirestoreForProfile: true,
};

const config = {
  firebase,
  rrfConfig,
  firebaseFunctions,
};

// The date when we exported the data for the bulletins and commanders
export const commanderAndBulletinDate = "28 March 2021";

export default config;

import {
  Analytics,
  getAnalytics,
  logEvent as logFirebaseEvent,
  setUserProperties,
  setUserId as setFirebaseUserID,
} from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getPerformance } from "firebase/performance";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

// Local
import config from "../config";

let performance;
let app: FirebaseApp | undefined;
let analytics: Analytics;
let db: Firestore | undefined;

const useEmulators = process.env.REACT_APP_EMULATOR && process.env.REACT_APP_EMULATOR !== "false";

/**
 * Initialize Firebase
 */
const init = (): void => {
  app = initializeApp(config.firebase());
  analytics = getAnalytics(app);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  performance = getPerformance(app);
  db = getFirestore(app);

  setUserProperties(analytics, { custom_platform: "web_app" });

  if (useEmulators) {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(functions(), "localhost", 5001);
  }
};

/**
 * Instance of the FB functions
 */
export const functions = () =>
  getFunctions(app, useEmulators ? undefined : config.firebaseFunctions.location);

/**
 * Log analytics event
 *
 * @param name name of the event
 * @param params parameters of the event
 */
const logEvent = (name: string, params?: Record<string, string | boolean>): void => {
  logFirebaseEvent(analytics, name, params);
};

/**
 * Setup user ID for analytics
 *
 * @param id User ID to add to analytics
 */
const setUserId = (id: string): void => setFirebaseUserID(analytics, id);

/**
 * Reset user ID
 */
const resetUserId = (): void => setUserId("");

const firebaseExport = {
  init,
  app,
  functions,
  logEvent,
  setUserId,
  resetUserId,
};

export default firebaseExport;

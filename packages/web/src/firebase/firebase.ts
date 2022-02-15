// Firebase
import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/performance";
import "firebase/storage";
import "firebase/firestore";
import "firebase/functions";

// Local
import config from "../config";
const analytics = firebase.analytics;
const performance = firebase.performance;
const firestore = firebase.firestore;
const initializeApp = firebase.initializeApp;
const app = firebase.app;

const useEmulators = process.env.REACT_APP_EMULATOR && process.env.REACT_APP_EMULATOR !== "false";

/**
 * Initialize Firebase
 */
const init = (): void => {
  initializeApp(config.firebase());
  analytics();
  performance();
  const db = firestore();
  const fn = functions();

  firebase.analytics().setUserProperties({custom_platform: 'web_app'});

  if (useEmulators) {
    db.settings({ host: "localhost:8080", ssl: false });
    fn.useFunctionsEmulator("http://localhost:5001");
  }
};

/**
 * Instance of the FB functions
 */
export const functions = (): firebase.functions.Functions =>
  app().functions(useEmulators ? undefined : config.firebaseFunctions.location);

/**
 * Log analytics event
 *
 * @param name name of the event
 * @param params parameters of the event
 */
const logEvent = (name: string, params?: Record<string, string | boolean>): void => {
  analytics().logEvent(name, params);
};

/**
 * Setup user ID for analytics
 *
 * @param id User ID to add to analytics
 */
const setUserId = (id: string): void => analytics().setUserId(id);

/**
 * Reset user ID
 */
const resetUserId = (): void => setUserId("");

const firebaseExport = {
  init,
  functions,
  logEvent,
  setUserId,
  resetUserId,
};

export default firebaseExport;

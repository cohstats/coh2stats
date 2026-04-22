import {
  Analytics,
  getAnalytics,
  logEvent as logFirebaseEvent,
  setUserProperties,
  setUserId as setFirebaseUserID,
} from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";

// Local
import config from "../config";

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

/**
 * Initialize Firebase
 */
const init = (): void => {
  // Prevent double initialization
  if (app) {
    return;
  }
  try {
    app = initializeApp(config.firebase());
    analytics = getAnalytics(app);
    setUserProperties(analytics, { custom_platform: "web_app" });
  } catch (e) {
    console.error("Firebase initialization error", e);
    return;
  }
};

// Initialize Firebase immediately on client-side
if (typeof window !== "undefined") {
  init();
}

/**
 * Log analytics event
 *
 * @param name name of the event
 * @param params parameters of the event
 */
const logEvent = (name: string, params?: Record<string, string | boolean>): void => {
  if (!analytics) {
    console.warn("Firebase Analytics not initialized");
    return;
  }

  // Skip logging events on localhost
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    return;
  }

  logFirebaseEvent(analytics, name, params);
};

/**
 * Setup user ID for analytics
 *
 * @param id User ID to add to analytics
 */
const setUserId = (id: string): void => {
  if (!analytics) {
    console.warn("Firebase Analytics not initialized");
    return;
  }
  setFirebaseUserID(analytics, id);
};

/**
 * Reset user ID
 */
const resetUserId = (): void => setUserId("");

const firebaseExport = {
  init,
  app,
  logEvent,
  setUserId,
  resetUserId,
};

export default firebaseExport;

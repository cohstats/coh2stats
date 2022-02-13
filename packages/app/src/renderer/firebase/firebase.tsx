import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, logEvent, setUserProperties } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA3aaUBNJx9s1euglz1kVOC5OV7Z0Ls5m0",
  authDomain: "coh2-ladders-prod.firebaseapp.com",
  projectId: "coh2-ladders-prod",
  storageBucket: "coh2-ladders-prod.appspot.com",
  messagingSenderId: "293737053254",
  appId: "1:293737053254:web:cce96727cae599741dde47",
  measurementId: "G-NG5E7L39X2",
};

// I am not sure if analytics works / I don't see myself in online analytics
// This will require additional exploration
let analytics: Analytics = null;

const firebaseInit = (): void => {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  // Because Analytics treats Electron as another browser we need to set up custom property
  setUserProperties(analytics, { custom_platform: "electron_app" });
};

// We should start all events with EA as indicator that it's electron app
// Analytics events can be called only after firabaseInit!
const events = {
  init: (): void => {
    logEvent(analytics, "ea_init");
  },
  game_displayed: (): void => {
    // Means that new game has been found
    logEvent(analytics, "ea_game_displayed");
  },
  settings: (): void => {
    // Means that settings has been opened
    logEvent(analytics, "ea_settings");
  },
  settings_changed: (settings_name: string): void => {
    // Means that settings has been changed
    logEvent(analytics, "ea_settings", {
      settings_name: settings_name,
    });
  },
  about: (): void => {
    // Means that about window has been opened
    logEvent(analytics, "ea_about");
  },
};

export { firebaseInit, events };

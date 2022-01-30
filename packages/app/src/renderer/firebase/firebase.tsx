import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, logEvent } from "firebase/analytics";

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
  events.init();
};

// WIP - Probably not working
const events = {
  init: (): void => {
    logEvent(analytics, "ea_init");
  },
};

export { firebaseInit, events };

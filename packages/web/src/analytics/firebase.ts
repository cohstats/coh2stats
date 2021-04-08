import { firebase } from "../firebase";

// Types
import type { Location } from "history";

type LoginMethod = "Google" | "Facebook" | "password";

interface ClickParams {
  link_classes?: string;
  link_domain?: string;
  link_id?: string;
  link_url?: string;
  outbound?: boolean;
}

const events = {
  pageView: (location: Location): void =>
    firebase.logEvent("page_view", { page_location: location.pathname + location.search }),
  login: (method: LoginMethod): void => firebase.logEvent("login", { method: method }),
  logout: (): void => firebase.logEvent("logout"),
  click: (params: ClickParams): void =>
    firebase.logEvent("click", params as { [key: string]: string | boolean }),
  tutorialBegin: (): void => firebase.logEvent("tutorial_begin"),
  tutorialComplete: (): void => firebase.logEvent("tutorial_complete"),
};

const login = (userID: string, method: LoginMethod = "Google"): void => {
  firebase.setUserId(userID);
  events.login(method);
};

const logout = (): void => {
  firebase.resetUserId();
  events.logout();
};

const pageView = (location: Location): void => {
  events.pageView(location);
};

const searchUsed = (term: string): void => {
  firebase.logEvent("search", { term: term });
};

const commanderDisplayed = (commanderName: string, commanderRace: string): void => {
  firebase.logEvent("commanders", { commanderName, commanderRace });
};

const bulletinsDisplayed = (): void => {
  firebase.logEvent("bulletins");
};

const firebaseObject = {
  login,
  logout,
  pageView,
  searchUsed,
  commanderDisplayed,
  bulletinsDisplayed,
};

export default firebaseObject;

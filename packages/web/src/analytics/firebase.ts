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

const statsDisplayed = (frequency: string, statsSource: string): void => {
  firebase.logEvent("stats", { frequency, statsSource });
};

const mapStatsDisplayed = (frequency: string): void => {
  firebase.logEvent("mapStats", { frequency });
};

const rangeStatsDisplayed = (statsSource: string): void => {
  firebase.logEvent("rangeStats", { statsSource });
};

const teamCompositionUsed = (faction: string, type: string): void => {
  firebase.logEvent("tcmWidgetUsed", { faction, type });
};

const liveMatchesDisplayed = (): void => {
  firebase.logEvent("liveMatches");
};

const leaderboardsDisplayed = (): void => {
  firebase.logEvent("leaderboards");
};

const playersPageDisplayed = (): void => {
  firebase.logEvent("playersPage");
};

const playerCardDisplayed = (): void => {
  firebase.logEvent("playerCard");
};

const playerCardMatchesDisplayed = (): void => {
  firebase.logEvent("playerCardMatches");
};

const playerCardCOHStatsMatchesDisplayed = (): void => {
  firebase.logEvent("playerCardCOHStatsMatches");
};

const mostRecentGamesPageDisplayed = (): void => {
  firebase.logEvent("mostRecentGamesPage");
};

const playerCardCOHStatsMatchesMoreGames = (): void => {
  firebase.logEvent("playerCardCOHStatsMatchesMore");
};

const playerCardMatchDetailsDisplayed = (): void => {
  firebase.logEvent("playerCardMatchDetails");
};

const playerCardFullMatchDetailsDisplayed = (): void => {
  firebase.logEvent("playerCardFullMatchDetails");
};

const leaderboardsDateInteraction = (type: string): void => {
  firebase.logEvent("leaderboardsDateInteraction", { type });
};

const leaderboardsTypeInteraction = (type: string, race: string): void => {
  firebase.logEvent("leaderboardsTypeInteraction", { type, race });
};

const singleMatchPageDisplayed = () => {
  firebase.logEvent("singleMatchDisplayed");
};

const singleMatchPlayerDetailsDisplayed = () => {
  firebase.logEvent("singleMatchPlayerDetailsDisplayed");
};

const firebaseAnalytics = {
  login,
  logout,
  pageView,
  searchUsed,
  commanderDisplayed,
  bulletinsDisplayed,
  singleMatchPageDisplayed,
  singleMatchPlayerDetailsDisplayed,
  mapStatsDisplayed,
  statsDisplayed,
  rangeStatsDisplayed,
  liveMatchesDisplayed,
  teamCompositionUsed,
  leaderboardsDisplayed,
  playerCardDisplayed,
  leaderboardsDateInteraction,
  leaderboardsTypeInteraction,
  playersPageDisplayed,
  playerCardMatchesDisplayed,
  playerCardMatchDetailsDisplayed,
  playerCardFullMatchDetailsDisplayed,
  playerCardCOHStatsMatchesDisplayed,
  playerCardCOHStatsMatchesMoreGames,
  mostRecentGamesPageDisplayed,
};

export default firebaseAnalytics;

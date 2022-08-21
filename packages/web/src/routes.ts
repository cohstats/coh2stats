const statsBase = () => {
  return "/stats";
};

const fullStatsOldDetails = (
  frequency = ":frequency",
  timestamp: string | number = ":timestamp",
  type = ":type",
  race = ":race",
): string => {
  //"/stats/:frequency/:timestamp/:type/:race"
  return `${statsBase()}/${frequency}/${timestamp}/${type}/${race}`;
};

const mapStats = () => {
  return "/map-stats";
};

const commanderBase = () => {
  return "/commanders";
};

const commanderList = (race = ":race") => {
  return `${commanderBase()}/${race}`;
};

const commanderByID = (race = ":race", commanderID = ":commanderID") => {
  return `${commanderList(race)}/${commanderID}`;
};

const desktopAppBase = () => {
  return "/desktop-app";
};

const aboutBase = () => {
  return "/about";
};

const bulletinsBase = () => {
  return "/bulletins";
};

const searchBase = () => {
  return "/search";
};

const searchWithParam = (param = ":searchParam") => {
  return `${searchBase()}/${param}`;
};

const leaderboardsBase = () => {
  return "/leaderboards";
};

const playerCardBase = () => {
  return "/players";
};

const liveMatchesBase = () => {
  return "/live-matches";
};

const playerCardWithId = (steamId = ":steamid") => {
  return `${playerCardBase()}/${steamId}`;
};

const playerCardWithIdAndName = (steamId = ":steamid") => {
  return `${playerCardBase()}/${steamId}-*`;
};

const singleMatch = (matchID = ":matchID") => {
  return `/matches/${matchID}`;
};

const routes = {
  statsBase,
  fullStatsOldDetails,
  liveMatchesBase,
  commanderBase,
  commanderList,
  commanderByID,
  aboutBase,
  mapStats,
  bulletinsBase,
  searchBase,
  searchWithParam,
  leaderboardsBase,
  playerCardBase,
  playerCardWithId,
  playerCardWithIdAndName,
  desktopAppBase,
  singleMatch,
};

export default routes;

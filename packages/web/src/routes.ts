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

const commanderBase = () => {
  return "/commanders";
};

const commanderList = (race = ":race") => {
  return `${commanderBase()}/${race}`;
};

const commanderByID = (race = ":race", commanderID = ":commanderID") => {
  return `${commanderList(race)}/${commanderID}`;
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

const matchesBase = () => {
  return "/matches";
};

const leaderboardsBase = () => {
  return "/leaderboards";
};

const playerCardBase = () => {
  return "/players";
};

const playerCardWithId = (steamId = ":steamid") => {
  return `${playerCardBase()}/${steamId}`;
};

const playerMatches = (steamId = ":steamid") => {
  return `${matchesBase()}/player/${steamId}`;
};

const routes = {
  statsBase,
  fullStatsOldDetails,
  commanderBase,
  commanderList,
  commanderByID,
  aboutBase,
  bulletinsBase,
  searchBase,
  searchWithParam,
  playerMatches,
  leaderboardsBase,
  playerCardBase,
  playerCardWithId,
};

export default routes;

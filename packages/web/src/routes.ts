const statsBase = () => {
  return "/stats";
};

const fullStatsDetails = (
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

const routes = {
  statsBase,
  fullStatsDetails,
  commanderBase,
  commanderList,
  commanderByID,
  aboutBase,
  bulletinsBase,
};

export default routes;

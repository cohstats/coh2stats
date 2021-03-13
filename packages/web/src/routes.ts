const fullStatsDetails = (
  frequency = ":frequency",
  timestamp = ":timestamp",
  type = ":type",
  race = ":race",
): string => {
  //"/stats/:frequency/:timestamp/:type/:race"
  return `/stats/${frequency}/${timestamp}/${type}/${race}`;
};

const routes = {
  fullStatsDetails,
};

export default routes;

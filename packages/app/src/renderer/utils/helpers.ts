import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const datesAreOnSameDay = (first: Date, second: Date): boolean => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() == second.getDate()
  );
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const convertTeamNames = (mode: string) => {
  if (mode.startsWith("team")) {
    return `Team of ${mode[4]}`;
  } else {
    return mode;
  }
};

/**
 * Needs to be only statGroups from single player
 * @param statGroups
 */
const findPlayerProfile = (statGroups: any) => {
  for (const statGroup of statGroups) {
    if (statGroup["type"] === 1) {
      return statGroup["members"][0];
    }
  }
};

export { timeAgo, datesAreOnSameDay, capitalize, convertTeamNames, findPlayerProfile };

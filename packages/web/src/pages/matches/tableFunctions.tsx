import { Tag } from "antd";
import { RaceName } from "../../coh/types";

/**
 * Returns duration string in HH:MM:SS format
 */
export function getMatchDuration(startTime: number, endTime: number) {
  return new Date((endTime - startTime) * 1000).toISOString().substr(11, 8); //return duration in HH:MM:SS format
}

/**
 * Returns src of <img> tag for each race
 */
export function getRaceImage(race: RaceName) {
  return `../resources/generalIcons/${race}.png`;
}

/**
 * Returns string based on how much time elapsed from the match start
 * Time < 1 Hour      returns MM minutes ago
 * Time < 1 Day       returns HH hours MM minutes ago
 * Time < 5 Days      returns X days ago
 * Time > 5 days      returns en-US locale date
 */
export function formatMatchTime(startTime: number) {
  const hourMillis = 3600 * 1000; // one day in a miliseconds range
  let difference = Date.now() - startTime * 1000; // start match vs NOW time difference in miliseconds
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let timeDifference = "";

  if (difference < hourMillis) {
    timeDifference = new Date(difference).toISOString().substr(14, 2) + " minutes ago";
  } else if (difference < hourMillis * 24) {
    timeDifference =
      new Date(difference).toISOString().substr(11, 2) +
      " hours " +
      new Date(difference).toISOString().substr(14, 2) +
      " minutes ago";
  } else if (difference < hourMillis * 128) {
    timeDifference = new Date(difference).toISOString().substr(9, 1) + " days ago";
  } else {
    timeDifference = new Date(startTime * 1000).toLocaleDateString("en-US", options);
  }
  return timeDifference; //return duration in HH:MM:SS format
}

/**
 * Returns Array of players belonging to faction "axis" | "allies"
 */
export function getMatchPlayersByFaction(
  reportedPlayerResults: Array<any>,
  faction: "axis" | "allies",
) {
  let factions = [];
  // loop thru all players
  for (let myKey in reportedPlayerResults) {
    switch (faction) {
      // search for all axis players
      case "axis":
        if (
          reportedPlayerResults[myKey].race_id === 0 ||
          reportedPlayerResults[myKey].race_id === 2
        ) {
          factions.push(reportedPlayerResults[myKey]);
        }
        break;
      // search for allies players
      case "allies":
        if (
          reportedPlayerResults[myKey].race_id !== 0 &&
          reportedPlayerResults[myKey].race_id !== 2
        ) {
          factions.push(reportedPlayerResults[myKey]);
        }
        break;
    }
  }
  return factions;
}

/**
 * Returns Antd element <Tag> [Axis victory] or [Allies victory]
 */
export function getMatchResult(reportedPlayerResults: Array<any>) {
  let winner: string = "";
  let color = "geekblue";

  // loop thru all players
  for (let myKey2 in reportedPlayerResults) {
    // find a winner
    if (reportedPlayerResults[myKey2].resulttype === 1) {
      // if its a axis player by race
      if (
        reportedPlayerResults[myKey2].race_id === 0 ||
        reportedPlayerResults[myKey2].race_id === 2
      ) {
        winner = "Axis victory"; // return axis victory
        color = "volcano";
      } else {
        winner = "Allies victory"; // else return allies victory
      }
      break;
    }
  }
  return <Tag color={color}>{winner.toUpperCase()}</Tag>;
}

/**
 * Returns String 1v1, 2v2 etc... based on matchType parameter
 */
export const formatMatchtypeID = (matchType: number): string => {
  let formattedMatchType: string;
  switch (matchType) {
    case 1:
      formattedMatchType = "1 v 1 ";
      break;
    case 2:
      formattedMatchType = "2 v 2 ";
      break;
    case 3:
      formattedMatchType = "3 v 3 ";
      break;
    case 4:
      formattedMatchType = "4 v 4 ";
      break;
    default:
      formattedMatchType = "unknown";
      break;
  }
  return formattedMatchType;
};

/**
 * Dictionary of {relic race number, raceName}
 */
export const raceIds: Record<number, RaceName> = {
  0: "wermacht",
  1: "soviet",
  2: "wgerman",
  3: "usf",
  4: "british",
};

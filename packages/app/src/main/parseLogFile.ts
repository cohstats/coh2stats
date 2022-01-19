import reverseLineReader from "reverse-line-reader";
import { Factions } from "../redux/state";
import { LogFileMatchData, LogFilePlayerData } from "./gameWatcher";

export const parseLogFileReverse = async (
  logFileLocation: string,
  lastGameId: string,
): Promise<false | { players: LogFileMatchData; newGameId: string }> => {
  // check warnings.log for new game
  let foundNewGame = false;
  let continueReading = true;
  // game id is constructed by joining the relicIDs of each player up to one string
  let constructedGameId = "";
  const players: LogFileMatchData = {
    left: [],
    right: [],
  };

  // read the log file from bottom to top to find the last logged game first
  await reverseLineReader.eachLine(logFileLocation, (line: string) => {
    handleGameParam(line, "Win Condition Name", () => {
      // reached the end lines describing a match
      if (constructedGameId !== lastGameId) {
        // found a new match
        foundNewGame = true;
      }
      continueReading = false; // do not continue reading log file when one match was found
    });
    handleGameParam(line, "Human Player", (subParams) => {
      const playerDataChunks = subParams.split(" ");
      const side = playerDataChunks[playerDataChunks.length - 2];
      const playerData: LogFilePlayerData = {
        ai: false,
        faction: playerDataChunks[playerDataChunks.length - 1].split("\r")[0] as Factions,
        relicID: playerDataChunks[playerDataChunks.length - 3],
        position: parseInt(playerDataChunks[1], 10),
        name: playerDataChunks.slice(2, playerDataChunks.length - 3).join(" "),
      };
      if (side === "0") {
        players.left.unshift(playerData);
      } else {
        players.right.unshift(playerData);
      }
      constructedGameId += "" + playerData.relicID;
    });
    handleGameParam(line, "AI Player", (subParams) => {
      const playerDataChunks = subParams.split(" ");
      const side = playerDataChunks[playerDataChunks.length - 2];
      const playerData: LogFilePlayerData = {
        ai: true,
        faction: playerDataChunks[playerDataChunks.length - 1].split("\r")[0] as Factions,
        relicID: "-1",
        position: parseInt(playerDataChunks[1], 10),
        name: playerDataChunks.slice(2, playerDataChunks.length - 3).join(" "),
      };
      if (side === "0") {
        players.left.unshift(playerData);
      } else {
        players.right.unshift(playerData);
      }
      constructedGameId += "-1 ";
    });
    return continueReading;
  });
  if (foundNewGame) {
    return { players, newGameId: constructedGameId };
  }
  return false;
};

const handleLogType = (line: string, logType: string, func: (remainingLine: string) => void) => {
  const lineWithoutTimeCode = line.substring(14);
  const firstSpaceIndex = lineWithoutTimeCode.indexOf(" ");
  if (firstSpaceIndex !== -1) {
    // found a space
    const foundLogType = lineWithoutTimeCode.substring(0, firstSpaceIndex);
    if (foundLogType === logType) {
      func(lineWithoutTimeCode.substring(firstSpaceIndex));
    }
  }
};

const handleGameLogs = (line: string, func: (remainingLine: string) => void) => {
  handleLogType(line, "GAME", func);
};

const handleGameParam = (line: string, param: string, func: (subParams: string) => void) => {
  handleGameLogs(line, (remainingLine) => {
    const parametersSeparatorIndex = remainingLine.indexOf(" -- ");
    if (parametersSeparatorIndex !== -1) {
      // found params
      const parametersString = remainingLine.substring(parametersSeparatorIndex + 4);
      const subParametersSeparatorIndex = parametersString.indexOf(":");
      if (subParametersSeparatorIndex !== -1) {
        // params with subparams
        const foundParam = parametersString.substring(0, subParametersSeparatorIndex);
        const subParams = parametersString.substring(subParametersSeparatorIndex + 1);
        if (foundParam === param) {
          // reached the end lines describing a match
          func(subParams);
        }
      }
    }
  });
};

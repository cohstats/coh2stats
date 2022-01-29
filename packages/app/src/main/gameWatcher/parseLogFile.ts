import reverseLineReader from "reverse-line-reader";
import { Factions, GameState } from "../../redux/state";

const factionSideLookupTable: Record<string, TeamSide> = {
  german: "axis",
  soviet: "allies",
  west_german: "axis",
  aef: "allies",
  british: "allies",
};

export type GameType = "classic" | "ai" | "custom";
export type TeamSide = "axis" | "allies" | "mixed";

export interface LogFilePlayerData {
  ai: boolean;
  faction: Factions;
  relicID: string;
  name: string;
  position: number;
}

export interface LogFileTeamData {
  players: LogFilePlayerData[];
  side: TeamSide;
}

export interface LogFileGameData {
  type: GameType;
  state: GameState;
  map: string;
  winCondition: string;
  left: LogFileTeamData;
  right: LogFileTeamData;
}

export const parseLogFileReverse = async (
  logFileLocation: string,
  lastGameId: string,
): Promise<{ new: boolean; game: LogFileGameData; newGameId: string }> => {
  // check warnings.log for new game
  let foundNewGame = false;
  let continueReading = true;
  // game id is constructed by joining the relicIDs of each player up to one string
  let constructedGameId = "";
  let gameLoading = false; // logs contains a start loading line
  let gameStarted = false; // logs contains a started game line
  let gameEnded = false; // logs contains a ended game line
  let gameRunning = true; // logs says application closed
  const game: LogFileGameData = {
    type: "custom",
    state: "closed",
    map: "",
    winCondition: "",
    left: {
      side: "mixed",
      players: [],
    },
    right: {
      side: "mixed",
      players: [],
    },
  };

  // read the log file from bottom to top to find the last logged game first
  await reverseLineReader.eachLine(logFileLocation, (line: string) => {
    if (line.includes("Application closed")) {
      gameRunning = false;
    }
    handleGameParam(line, "Scenario", (params) => {
      const split = params.split("\\");
      const map = split[split.length - 1];
      game.map = map;
      continueReading = false; // do not continue reading log file when one game was found
    });
    handleGameParam(line, "Win Condition Name", (params) => {
      const winCondition = params.replace(/\s/g, ""); // remove spaces
      game.winCondition = winCondition;
      // reached the end lines describing a game
      if (constructedGameId !== lastGameId) {
        // found a new game
        foundNewGame = true;
      }
      gameLoading = true;
    });
    handleGameParam(line, "Starting mission", () => {
      gameStarted = true;
    });
    handleGameOver(line, () => {
      gameEnded = true;
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
        game.left.players.unshift(playerData);
      } else {
        game.right.players.unshift(playerData);
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
        game.left.players.unshift(playerData);
      } else {
        game.right.players.unshift(playerData);
      }
      constructedGameId += "-1 ";
    });
    return continueReading;
  });
  game.state = determineGameState(gameLoading, gameStarted, gameEnded, gameRunning);
  if (foundNewGame) {
    return { new: true, game: determineGameType(game), newGameId: constructedGameId };
  }
  return { new: false, game: game, newGameId: constructedGameId };
};

const determineGameState = (
  loading: boolean,
  started: boolean,
  ended: boolean,
  running: boolean,
): GameState => {
  if (!running) {
    return "closed";
  }
  if (ended || !loading) {
    return "menu";
  }
  if (started) {
    return "ingame";
  }
  if (loading) {
    return "loading";
  }
  return "menu";
};

const determineGameType = (game: LogFileGameData): LogFileGameData => {
  let foundAi = false;
  let foundMixedTeam = false;
  const leftComp = determineTeamComposition(game.left);
  const rightComp = determineTeamComposition(game.right);
  if (leftComp.ai || rightComp.ai) {
    foundAi = true;
  }
  if (leftComp.side === "mixed" || rightComp.side === "mixed") {
    foundMixedTeam = true;
  }
  return {
    type: foundMixedTeam ? "custom" : foundAi ? "ai" : "classic",
    state: game.state,
    map: game.map,
    winCondition: game.winCondition,
    left: {
      side: leftComp.side,
      players: game.left.players,
    },
    right: {
      side: rightComp.side,
      players: game.right.players,
    },
  };
};

const determineTeamComposition = (team: LogFileTeamData): { ai: boolean; side: TeamSide } => {
  let foundAi = false;
  let mixed = false;
  let lastSide: null | TeamSide;
  team.players.forEach((player) => {
    if (player.ai) {
      foundAi = true;
    }
    if (lastSide && factionSideLookupTable[player.faction] !== lastSide) {
      mixed = true;
    }
    lastSide = factionSideLookupTable[player.faction];
  });
  return { ai: foundAi, side: mixed ? "mixed" : lastSide };
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

const handleModLogs = (line: string, func: (remainingLine: string) => void) => {
  handleLogType(line, "MOD", func);
};

const handleGameOver = (line: string, func: () => void) => {
  handleModLogs(line, (remainingLine) => {
    const parametersSeparatorIndex = remainingLine.indexOf(" -- ");
    if (parametersSeparatorIndex !== -1) {
      const remainingString = remainingLine.substring(parametersSeparatorIndex + 4);
      if (remainingString.includes("Game Over at frame")) {
        func();
      }
    }
  });
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
          // reached the end lines describing a game
          func(subParams);
        }
      }
    }
  });
};

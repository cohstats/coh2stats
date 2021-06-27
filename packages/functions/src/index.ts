import * as admin from "firebase-admin";

admin.initializeApp();

export { getCOHLadders } from "./getCOHLadders";
export { getPlayerMatches } from "./getPlayerMatches";
export { runTest } from "./runTest";
export { runAnalysis } from "./runAnalysis";
export { getPlayerMatchesFromRelic } from "./getPlayerMatchesRelic";
export { searchPlayersOnRelic } from "./searchPlayersRelic";
export { searchPlayers } from "./searchPlayers";
export { triggerNumberOfOnlinePlayers } from "./triggerOnlinePlayers";
export { getCustomAnalysis } from "./getCustomAnalysis";

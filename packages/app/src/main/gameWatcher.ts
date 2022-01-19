import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { ApplicationStore } from "./electronStore";
import { actions } from "../redux/slice";
import { Unsubscribe } from "@reduxjs/toolkit";
import { Factions, LadderStats, Member, SideData } from "../redux/state";
import axios, { AxiosResponse } from "axios";
import {
  LeaderboardStat,
  PersonalStatResponse,
  StatGroup,
  StatGroupMember,
} from "./relicAPITypes";
import { notifyGameFound } from "./notification";
import { locateWarningsFile } from "./locateWarningsDialog";
import { parseLogFileReverse } from "./parseLogFile";

export interface LogFilePlayerData {
  ai: boolean;
  faction: Factions;
  relicID: string;
  name: string;
  position: number;
}
export interface LogFileMatchData {
  left: LogFilePlayerData[];
  right: LogFilePlayerData[];
}

const leaderboardIDLookupTable = {
  german: [4, 8, 12, 16],
  soviet: [5, 9, 13, 17],
  west_german: [6, 10, 14, 18],
  aef: [7, 11, 15, 19],
  axis: [20, 22, 24],
  allies: [21, 23, 25],
  british: [51, 52, 53, 54],
};

export class GameWatcher {
  applicationStore: ApplicationStore;
  currentIntervalTime: number;
  nodeInterval: NodeJS.Timer;
  lastGameId: string;
  isFirstScan: boolean;
  unsubscriber: Unsubscribe;

  constructor(applicationStore: ApplicationStore) {
    this.isFirstScan = true;
    this.applicationStore = applicationStore;
    const settings = this.applicationStore.getState().settings;
    if (!settings.coh2LogFileFound) {
      // check for warnings.log file in expected folder
      const theoreticalLogPath = path.resolve(
        app.getPath("documents"),
        "My Games",
        "Company of Heroes 2",
        "warnings.log",
      );
      if (fs.existsSync(theoreticalLogPath)) {
        this.applicationStore.dispatch(actions.setLogFileFound(true));
        this.applicationStore.dispatch(actions.setLogFilePath(theoreticalLogPath));
      }
    }

    // start interval
    this.lastGameId = "";
    this.currentIntervalTime = settings.updateInterval;
    this.setInterval(this.currentIntervalTime);

    ipcMain.on("locateLogFile", async () => {
      const filePath = await locateWarningsFile();
      if (fs.existsSync(filePath)) {
        this.applicationStore.dispatch(actions.setLogFileFound(true));
        this.applicationStore.dispatch(actions.setLogFilePath(filePath));
      }
    });
    ipcMain.on("scanForLogFile", () => {
      const theoreticalLogPath = path.resolve(
        app.getPath("documents"),
        "My Games",
        "Company of Heroes 2",
        "warnings.log",
      );
      if (fs.existsSync(theoreticalLogPath)) {
        this.applicationStore.dispatch(actions.setLogFileFound(true));
        this.applicationStore.dispatch(actions.setLogFilePath(theoreticalLogPath));
      }
    });

    // listen to settings changes
    this.unsubscriber = this.applicationStore.runtimeStore.subscribe(this.runtimeStoreSubscriber);
  }

  protected runtimeStoreSubscriber = (): void => {
    const settings = this.applicationStore.getState().settings;
    if (settings.updateInterval !== this.currentIntervalTime) {
      this.updateInterval(settings.updateInterval);
    }
  };

  protected intervalHandler = (): void => {
    const settings = this.applicationStore.getState().settings;
    if (settings.coh2LogFileFound && fs.existsSync(settings.coh2LogFileLocation)) {
      parseLogFileReverse(settings.coh2LogFileLocation, this.lastGameId).then(
        this.processLogFileResult,
      );
    }
  };

  protected processLogFileResult = (
    result: false | { players: LogFileMatchData; newGameId: string },
  ): void => {
    if (result) {
      this.lastGameId = result.newGameId;
      // send a notification
      if (!this.isFirstScan && this.applicationStore.getState().settings.gameNotification) {
        notifyGameFound();
      }
      this.isFirstScan = false;
      // now fetch the player stats
      this.fetchDataFromRelicAPI(result.players).then(
        (response: AxiosResponse<PersonalStatResponse>) => {
          const apiData = response.data;
          if (response.status === 200 && apiData.result.code === 0) {
            this.applicationStore.dispatch(
              actions.setMatchData({
                display: true,
                left: this.parseSideData(result.players.left, apiData),
                right: this.parseSideData(result.players.right, apiData),
              }),
            );
          } else {
            this.handleAPIRequestFailed();
          }
        },
        (reason) => {
          this.handleAPIRequestFailed();
          console.log(reason);
        },
      );
    }
  };

  /*protected parseLogFileReverse = async () => {
    // check warnings.log for new game
    let foundNewGame = false;
    // game id is constructed by joining the relicIDs of each player up to one string
    let constructedGameId = "";
    const players: LogFileMatchData = {
      left: [],
      right: []
    };

    // read the log file from bottom to top to find the last logged game first
    await reverseLineReader.eachLine(this.applicationStore.getState().settings.coh2LogFileLocation, (line: string) => {
      const lineWithoutTimeCode = line.substring(14);
      const firstSpaceIndex = lineWithoutTimeCode.indexOf(' ');
      if (firstSpaceIndex !== -1) { // found a space
        const logType = lineWithoutTimeCode.substring(0, firstSpaceIndex);
        if (logType === "GAME") { // found game specific log
          const parametersSeparatorIndex = lineWithoutTimeCode.indexOf(" -- ");
          if (parametersSeparatorIndex !== -1) { // found params
            const parametersString = lineWithoutTimeCode.substring(parametersSeparatorIndex + 4);
            const subParametersSeparatorIndex = parametersString.indexOf(":");
            if (subParametersSeparatorIndex !== -1) { // params with subparams
              const param = parametersString.substring(0, subParametersSeparatorIndex);
              const subParams = parametersString.substring(subParametersSeparatorIndex + 1);
              if (param === "Win Condition Name") { // reached the end lines describing a match
                if (constructedGameId !== this.lastGameId) { // found a new match
                  foundNewGame = true;
                  this.lastGameId = constructedGameId;
                }
                return false; // do not continue reading log file when one match was found
              }
              if (param === "Human Player") {
                const playerDataChunks = subParams.split(" ");
                const side = playerDataChunks[playerDataChunks.length - 2];
                const playerData: LogFilePlayerData = {
                  ai: false,
                  faction: playerDataChunks[playerDataChunks.length - 1].split("\r")[0] as Factions,
                  relicID: playerDataChunks[playerDataChunks.length - 3],
                  position: parseInt(playerDataChunks[1], 10),
                  name: playerDataChunks.slice(2, playerDataChunks.length - 3).join(" ")
                }
                if (side === "0") {
                  players.left.unshift(playerData);
                } else {
                  players.right.unshift(playerData);
                }
                constructedGameId += "" + playerData.relicID;
              }
              if (param === "AI Player") {
                const playerDataChunks = subParams.split(" ");
                const side = playerDataChunks[playerDataChunks.length - 2];
                const playerData: LogFilePlayerData = {
                  ai: true,
                  faction: playerDataChunks[playerDataChunks.length - 1].split("\r")[0] as Factions,
                  relicID: "-1",
                  position: parseInt(playerDataChunks[1], 10),
                  name: playerDataChunks.slice(2, playerDataChunks.length - 3).join(" ")
                }
                if (side === "0") {
                  players.left.unshift(playerData);
                } else {
                  players.right.unshift(playerData);
                }
                constructedGameId += '-1 ';
              }
            }
          }
        }
      }
      return true; // continue with next line
    });
    if (foundNewGame) {
      return players;
    }
    return false;
  }*/

  protected parseSideData = (
    logFilePlayers: LogFilePlayerData[],
    apiData: PersonalStatResponse,
  ): SideData => {
    const copyLeaderboardStatsToLadderStats = (
      leaderboardStats: LeaderboardStat,
      ladderStats: LadderStats,
    ) => {
      ladderStats.wins = leaderboardStats.wins;
      ladderStats.losses = leaderboardStats.losses;
      ladderStats.streak = leaderboardStats.streak;
      ladderStats.disputes = leaderboardStats.disputes;
      ladderStats.drops = leaderboardStats.drops;
      ladderStats.rank = leaderboardStats.rank;
      ladderStats.ranktotal = leaderboardStats.ranktotal;
      ladderStats.ranklevel = leaderboardStats.ranklevel;
      ladderStats.regionrank = leaderboardStats.regionrank;
      ladderStats.regionranktotal = leaderboardStats.regionranktotal;
      ladderStats.lastmatchdate = leaderboardStats.lastmatchdate;
    };
    const setMemberWithStatGroupMember = (statGroupMember: StatGroupMember, member: Member) => {
      member.relicID = statGroupMember.profile_id;
      const steamStringSplit = statGroupMember.name.split("/") as string[];
      member.steamID = steamStringSplit[steamStringSplit.length - 1];
      member.xp = statGroupMember.xp;
      member.level = statGroupMember.level;
      member.country = statGroupMember.country;
    };
    const { statGroups, leaderboardStats } = apiData;
    const soloData: LadderStats[] = new Array(logFilePlayers.length);
    const soloComplete: Map<number, boolean> = new Map(logFilePlayers.map((p, i) => [i, false]));
    // create a starter to populate later
    logFilePlayers.forEach((logFilePlayer, index) => {
      const soloMember: Member = {
        ai: logFilePlayer.ai,
        relicID: logFilePlayer.ai ? -(index + 1) : parseInt(logFilePlayer.relicID, 10),
        name: logFilePlayer.name,
        faction: logFilePlayer.faction,
        steamID: "",
        xp: -1,
        level: -1,
        country: "",
      };
      if (logFilePlayer.ai) {
        soloComplete.delete(index);
      }
      soloData[index] = {
        members: [soloMember],
        wins: -1,
        losses: -1,
        streak: -1,
        disputes: -1,
        drops: -1,
        rank: -1,
        ranktotal: -1,
        ranklevel: -1,
        regionrank: -1,
        regionranktotal: -1,
        lastmatchdate: -1,
      };
    });
    const teamData: Record<string, LadderStats> = {};
    const maxTeamLeaderboardId = 17 + logFilePlayers.length * 2;
    const processSoloLeaderboardStats = (leaderboardStat: LeaderboardStat) => {
      const leaderboardId = leaderboardStat.leaderboard_id;
      if (
        soloComplete.size > 0 &&
        ((leaderboardId > 3 && leaderboardId < 20) || (leaderboardId > 50 && leaderboardId < 55))
      ) {
        const soloStatGroup = statGroups.find(
          (statGroup) => statGroup.id === leaderboardStat.statgroup_id,
        );
        if (soloStatGroup) {
          let matchingPlayerId: number | undefined = undefined;
          soloComplete.forEach((v, k) => {
            const wantedLeaderboardId =
              leaderboardIDLookupTable[soloData[k].members[0].faction][logFilePlayers.length - 1];
            if (
              soloData[k].members[0].relicID === soloStatGroup.members[0].profile_id &&
              wantedLeaderboardId === leaderboardId
            ) {
              // found the right entry
              copyLeaderboardStatsToLadderStats(leaderboardStat, soloData[k]);
              setMemberWithStatGroupMember(soloStatGroup.members[0], soloData[k].members[0]);
              matchingPlayerId = k;
            }
          });
          soloComplete.delete(matchingPlayerId);
        }
      }
    };
    const checkIfAllMembersArePlaying = (teamStatGroup: StatGroup) => {
      let isPlaying = true;
      let statGroupMemberId = 0;
      const matchedLogFilePlayers: LogFilePlayerData[] = new Array(teamStatGroup.members.length);
      while (statGroupMemberId < teamStatGroup.members.length) {
        const teamStatMemberRelicId = teamStatGroup.members[statGroupMemberId].profile_id;
        let foundMember = false;
        let logFilePlayerId = 0;
        while (logFilePlayerId < logFilePlayers.length) {
          const logFilePlayerRelicId = parseInt(logFilePlayers[logFilePlayerId].relicID, 10);
          if (teamStatMemberRelicId === logFilePlayerRelicId) {
            foundMember = true;
            matchedLogFilePlayers[statGroupMemberId] = logFilePlayers[logFilePlayerId];
            logFilePlayerId = logFilePlayers.length;
          }
          logFilePlayerId++;
        }
        if (!foundMember) {
          isPlaying = false;
          statGroupMemberId = teamStatGroup.members.length;
        }
        statGroupMemberId++;
      }
      if (isPlaying) {
        return matchedLogFilePlayers;
      }
      return false;
    };
    const processTeamLeaderboardStats = (leaderboardStat: LeaderboardStat) => {
      const leaderboardId = leaderboardStat.leaderboard_id;
      if (leaderboardId > 19 && leaderboardId <= maxTeamLeaderboardId) {
        // team ranking
        const teamStatGroup = statGroups.find(
          (statGroup) => statGroup.id === leaderboardStat.statgroup_id,
        );
        if (teamStatGroup) {
          // check if all members of statgroup are playing in the match
          const result = checkIfAllMembersArePlaying(teamStatGroup);
          if (result) {
            // generate unique index by concatenating sorted relicIds
            const uniqueTeamId = teamStatGroup.members
              .map((member) => member.profile_id)
              .sort((a, b) => a - b)
              .map((relicId) => "" + relicId)
              .join("");
            const teamMembers: Member[] = new Array(teamStatGroup.members.length);
            for (let k = 0; k < teamStatGroup.members.length; k++) {
              const statGroupMember = teamStatGroup.members[k];
              const matchedSideMember = result[k];
              const teamMemberSteamStringSplit = statGroupMember.name.split("/") as string[];
              teamMembers[k] = {
                ai: false,
                relicID: statGroupMember.profile_id,
                name: matchedSideMember.name,
                faction: matchedSideMember.faction,
                steamID: teamMemberSteamStringSplit[teamMemberSteamStringSplit.length - 1],
                xp: statGroupMember.xp,
                level: statGroupMember.level,
                country: statGroupMember.country,
              };
            }
            const teamLadderStats: LadderStats = {
              members: teamMembers,
              wins: -1,
              losses: -1,
              streak: -1,
              disputes: -1,
              drops: -1,
              rank: -1,
              ranktotal: -1,
              ranklevel: -1,
              regionrank: -1,
              regionranktotal: -1,
              lastmatchdate: -1,
            };
            copyLeaderboardStatsToLadderStats(leaderboardStat, teamLadderStats);
            teamData[uniqueTeamId] = teamLadderStats;
          }
        }
      }
    };
    leaderboardStats.forEach((leaderboardStat) => {
      // add additional data to solo entries
      processSoloLeaderboardStats(leaderboardStat);
      processTeamLeaderboardStats(leaderboardStat);
    });
    return {
      solo: soloData,
      teams: Object.values(teamData).sort(
        (a, b) => (b.members.length - a.members.length) * 100 + (b.ranklevel - a.ranklevel),
      ),
    };
  };

  protected handleAPIRequestFailed = (): void => {
    console.log("Request Failed");
    this.lastGameId = ""; // retry in next interval
    this.isFirstScan = true; // do not notify more than once when request fail
  };

  protected fetchDataFromRelicAPI = (
    players: LogFileMatchData,
  ): Promise<AxiosResponse<PersonalStatResponse>> => {
    const profile_ids = players.left
      .concat(players.right)
      .filter((player) => !player.ai)
      .map((player) => player.relicID)
      .join();
    const requestURL =
      "https://coh2-api.reliclink.com/community/leaderboard/GetPersonalStat?title=coh2&profile_ids=[" +
      profile_ids +
      "]";
    console.log("Relic API request");
    return axios.get(requestURL);
  };

  /*protected fetchDetailedMatchData = async (players: LogFileMatchData) => {
    let requestFailed = false;
    const detailedMatchData: MatchData = {
      display: true,
      left: {
        solo: [],
        teams: []
      },
      right: {
        solo: [],
        teams: []
      }
    };
    const copyLeaderboardStatsToLadderStats = (leaderboardStats: any, ladderStats: LadderStats) => {
      ladderStats.wins = leaderboardStats.wins;
      ladderStats.losses = leaderboardStats.losses;
      ladderStats.streak = leaderboardStats.streak;
      ladderStats.disputes = leaderboardStats.disputes;
      ladderStats.drops = leaderboardStats.drops;
      ladderStats.rank = leaderboardStats.rank;
      ladderStats.ranktotal = leaderboardStats.ranktotal;
      ladderStats.ranklevel = leaderboardStats.ranklevel;
      ladderStats.regionrank = leaderboardStats.regionrank;
      ladderStats.regionranktotal = leaderboardStats.regionranktotal;
      ladderStats.lastmatchdate = leaderboardStats.lastmatchdate;
    }
    const checkSide = async (sideMembers: LogFilePlayerData[], destination: SideData) => {
      if (requestFailed) {
        return;
      }
      const maxTeamLeaderboardId = 17 + sideMembers.length * 2;
      const teamLeaderboardStats: Record<string, LadderStats> = {};
      for (let i = 0; i < sideMembers.length; i++) {
        const player = sideMembers[i];
        const soloMember: Member = {
          ai: true,
          relicID: -(i+1),
          name: player.name,
          faction: player.faction,
          steamID: "",
          xp: 0,
          level: 0,
          country: ""
        }
        const soloLadderStats: LadderStats = {
          members: [soloMember],
          wins: -1,
          losses: -1,
          streak: -1,
          disputes: -1,
          drops: -1,
          rank: -1,
          ranktotal: -1,
          ranklevel: -1,
          regionrank: -1,
          regionranktotal: -1,
          lastmatchdate: -1
        }
        if (!player.ai) {
          const personalStatURL = "https://coh2-api.reliclink.com/community/leaderboard/GetPersonalStat?title=coh2&profile_ids=[" + player.relicID + "]";
          try {
            console.log("RelicAPI request");
            const axiosResponse = await axios.get(personalStatURL);
            const apiData = axiosResponse.data as PersonalStatResponse;
            const statGroups = apiData.statGroups;
            const leaderboardStats = apiData.leaderboardStats;
            const additionalPlayerData = statGroups[0].members.find(
              (member: any) => member.profile_id === parseInt(player.relicID, 10)
            );
            soloMember.ai = false;
            soloMember.relicID = additionalPlayerData.profile_id;
            soloMember.name = player.name;
            const steamStringSplit = additionalPlayerData.name.split("/") as string[];
            soloMember.steamID = steamStringSplit[steamStringSplit.length - 1];
            soloMember.xp = additionalPlayerData.xp;
            soloMember.level = additionalPlayerData.level;
            soloMember.country = additionalPlayerData.country;
            // go through all leaderboardStats
            const soloLeaderboardId = leaderboardIDLookupTable[player.faction][sideMembers.length - 1];
            leaderboardStats.forEach((leaderboardStat) => {
              const leaderboardId = leaderboardStat.leaderboard_id;
              if(leaderboardId === soloLeaderboardId) {
                copyLeaderboardStatsToLadderStats(leaderboardStat, soloLadderStats);
              }
              //"axis": [20, 22, 24],
              //"allies": [21,23,25],
              // is a qualified team leaderboardstat
              if (leaderboardId > 19 && leaderboardId <= maxTeamLeaderboardId) {
                const teamStatGroup = statGroups.find((statGroup) => statGroup.id === leaderboardStat.statgroup_id);
                if (teamStatGroup) {
                  // check if all members of statgroup are playing in the match
                  let isPlaying = true;
                  let statGroupMemberId = 0;
                  const matchedSideMembers: LogFilePlayerData[] = new Array(teamStatGroup.members.length);
                  while (statGroupMemberId < teamStatGroup.members.length) {
                    const teamStatMemberRelicId = teamStatGroup.members[statGroupMemberId].profile_id;
                    let foundMember = false;
                    let sideMemberId = 0;
                    while (sideMemberId < sideMembers.length) {
                      const sideMemberRelicId = parseInt(sideMembers[sideMemberId].relicID, 10);
                      if (teamStatMemberRelicId === sideMemberRelicId) {
                        foundMember = true;
                        matchedSideMembers[statGroupMemberId] = sideMembers[sideMemberId];
                        sideMemberId = sideMembers.length;
                      }
                      sideMemberId++;
                    }
                    if (!foundMember) {
                      isPlaying = false;
                      statGroupMemberId = teamStatGroup.members.length;
                    }
                    statGroupMemberId++;
                  }
                  if (isPlaying) {
                    // generate unique index by concatenating sorted relicIds
                    const uniqueTeamId = teamStatGroup.members.map(member => member.profile_id).sort((a, b) => a - b).map(relicId => "" + relicId).join("");
                    const teamMembers: Member[] = new Array(teamStatGroup.members.length);
                    for (let k = 0; k < teamStatGroup.members.length; k++) {
                      const statGroupMember = teamStatGroup.members[k];
                      const matchedSideMember = matchedSideMembers[k];
                      const teamMemberSteamStringSplit = statGroupMember.name.split("/") as string[];
                      teamMembers[k] = {
                        ai: false,
                        relicID: statGroupMember.profile_id,
                        name: matchedSideMember.name,
                        faction: matchedSideMember.faction,
                        steamID: teamMemberSteamStringSplit[teamMemberSteamStringSplit.length - 1],
                        xp: statGroupMember.xp,
                        level: statGroupMember.level,
                        country: statGroupMember.country
                      }
                    }
                    const teamLadderStats: LadderStats = {
                      members: teamMembers,
                      wins: -1,
                      losses: -1,
                      streak: -1,
                      disputes: -1,
                      drops: -1,
                      rank: -1,
                      ranktotal: -1,
                      ranklevel: -1,
                      regionrank: -1,
                      regionranktotal: -1,
                      lastmatchdate: -1
                    }
                    copyLeaderboardStatsToLadderStats(leaderboardStat, teamLadderStats);
                    teamLeaderboardStats[uniqueTeamId] = teamLadderStats;
                  }
                }
              }
            });
          } catch(e) {
            // timeout
            console.log(e);
            console.log("request failed");
            requestFailed = true;
            this.lastGameId = ""; // retry in next interval
            this.isFirstScan = true; // do not notify more than once when request fail
            return;
          }
        }
        destination.solo[i] = soloLadderStats;
      }
      destination.teams = Object.values(teamLeaderboardStats).sort((a, b) => (b.members.length - a.members.length) * 100 + (b.ranklevel - a.ranklevel));
    }
    await checkSide(players.left, detailedMatchData.left);
    await checkSide(players.right, detailedMatchData.right);
    if(requestFailed) {
      return;
    }
    this.applicationStore.dispatch(actions.setMatchData(detailedMatchData));
  }*/

  protected setInterval(checkInterval: number): void {
    this.nodeInterval = setInterval(this.intervalHandler, checkInterval * 1000);
  }

  protected updateInterval(newCheckInterval: number): void {
    clearInterval(this.nodeInterval);
    this.currentIntervalTime = newCheckInterval;
    this.setInterval(newCheckInterval);
  }

  destroy(): void {
    this.unsubscriber();
    clearInterval(this.nodeInterval);
  }
}

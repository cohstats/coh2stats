import { app } from "electron";
import path from "path";
import fs from "fs";
import reverseLineReader from 'reverse-line-reader';
import { ApplicationStore } from './electronStore';
import { actions } from "../redux/slice";
import { Unsubscribe } from "@reduxjs/toolkit";
import { Factions, LadderStats, MatchData, Member, SideData } from "../redux/state";
import axios from "axios";
import { PersonalStatResponse } from "./relicAPITypes";
import { notifyGameFound } from "./notification";

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
  "german": [4,8,12,16],
  "soviet": [5,9,13,17],
  "west_german": [6,10,14,18],
  "aef": [7,11,15,19],
  "axis": [20, 22, 24],
  "allies": [21,23,25],
  "british": [51,52,53,54],
}

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
      const theoreticalLogPath = path.resolve(app.getPath("documents"), "My Games", "Company of Heroes 2", "warnings.log");
      if (fs.existsSync(theoreticalLogPath)) {
        this.applicationStore.dispatch(actions.setLogFileFound(true));
        this.applicationStore.dispatch(actions.setLogFilePath(theoreticalLogPath));
      }
    }

    // start interval
    this.lastGameId = "";
    this.currentIntervalTime = settings.updateInterval;
    this.setInterval(this.currentIntervalTime);

    // listen to settings changes
    this.unsubscriber = this.applicationStore.runtimeStore.subscribe(this.runtimeStoreSubscriber);
  }

  protected runtimeStoreSubscriber = () => {
    const settings = this.applicationStore.getState().settings;
    if (settings.updateInterval !== this.currentIntervalTime) {
      this.updateInterval(settings.updateInterval);
    }
  }

  protected checkLogFile = () => {
    const settings = this.applicationStore.getState().settings;
    if (settings.coh2LogFileFound && fs.existsSync(settings.coh2LogFileLocation)) {
      // check warnings.log for new game
      let foundNewGame = false;
      // game id is constructed by joining the relicIDs of each player up to one string
      let constructedGameId = "";
      const players: LogFileMatchData = {
        left: [],
        right: []
      };

      // read the log file from bottom to top to find the last logged game first
      reverseLineReader.eachLine(settings.coh2LogFileLocation, (line: string) => {
        const lineWithoutTimeCode = line.substring(14);
        const firstSpaceIndex = lineWithoutTimeCode.indexOf(' ');
        if (firstSpaceIndex !== -1) { // found a space
          const logType = lineWithoutTimeCode.substring(0, firstSpaceIndex);
          if (logType === "GAME") { // found game specific log
            const parametersSeperatorIndex = lineWithoutTimeCode.indexOf(" -- ");
            if (parametersSeperatorIndex !== -1) { // found params
              const parametersString = lineWithoutTimeCode.substring(parametersSeperatorIndex + 4);
              const subParametersSeperatorIndex = parametersString.indexOf(":");
              if (subParametersSeperatorIndex !== -1) { // params with subparams
                const param = parametersString.substring(0, subParametersSeperatorIndex);
                const subParams = parametersString.substring(subParametersSeperatorIndex + 1);
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
      }).then(async () => {
        if (foundNewGame) {
          // send a notification
          if (!this.isFirstScan && this.applicationStore.getState().settings.gameNotification){
            notifyGameFound();
          }
          this.isFirstScan = false;
          // now fetch the player stats
          await this.fetchDetailedMatchData(players);
        }
      });
    }
  }

  protected fetchDetailedMatchData = async (players: LogFileMatchData) => {
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
      destination.teams = Object.values(teamLeaderboardStats);
    }
    await checkSide(players.left, detailedMatchData.left);
    await checkSide(players.right, detailedMatchData.right);
    if(requestFailed) {
      return;
    }
    this.applicationStore.dispatch(actions.setMatchData(detailedMatchData));
  }

  protected fetchDetailedPlayerData = async (player: LogFilePlayerData) => {
    if (!player.ai) {

    } else {

    }
  }

  protected setInterval(checkInterval: number) {
    this.nodeInterval = setInterval(this.checkLogFile, checkInterval*1000);
  }

  protected updateInterval(newCheckInterval: number) {
    clearInterval(this.nodeInterval);
    this.currentIntervalTime = newCheckInterval;
    this.setInterval(newCheckInterval);
  }

  destroy() {
    this.unsubscriber();
    clearInterval(this.nodeInterval);
  }
}

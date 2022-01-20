import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { ApplicationStore } from "./electronStore";
import { actions } from "../redux/slice";
import { Unsubscribe } from "@reduxjs/toolkit";
import { LadderStats, Member, SideData } from "../redux/state";
import axios, { AxiosResponse } from "axios";
import {
  LeaderboardStat,
  PersonalStatResponse,
  StatGroup,
  StatGroupMember,
} from "./relicAPITypes";
import { notifyGameFound } from "./notification";
import { locateWarningsFile } from "./locateWarningsDialog";
import {
  LogFileGameData,
  LogFilePlayerData,
  LogFileTeamData,
  parseLogFileReverse,
  TeamSide,
} from "./parseLogFile";

const leaderboardIDLookupTable = {
  german: [4, 8, 12, 16],
  soviet: [5, 9, 13, 17],
  west_german: [6, 10, 14, 18],
  aef: [7, 11, 15, 19],
  axis: [20, 22, 24],
  allies: [21, 23, 25],
  british: [51, 52, 53, 54],
};

const teamLeaderboardIdsLookupTable: Record<TeamSide, number[]> = {
  axis: [20, 22, 24],
  allies: [21, 23, 25],
  mixed: [],
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
    result: false | { game: LogFileGameData; newGameId: string },
  ): void => {
    if (result) {
      this.lastGameId = result.newGameId;
      // send a notification
      if (!this.isFirstScan && this.applicationStore.getState().settings.gameNotification) {
        notifyGameFound();
      }
      this.isFirstScan = false;
      // now fetch the player stats
      this.fetchDataFromRelicAPI(result.game).then(
        (response: AxiosResponse<PersonalStatResponse>) => {
          const apiData = response.data;
          if (response.status === 200 && apiData.result.code === 0) {
            this.applicationStore.dispatch(
              actions.setMatchData({
                display: true,
                left: this.parseSideData(result.game.left, apiData),
                right: this.parseSideData(result.game.right, apiData),
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

  protected parseSideData = (
    logFileTeam: LogFileTeamData,
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
    const soloData: LadderStats[] = new Array(logFileTeam.players.length);
    const soloComplete: Map<number, boolean> = new Map(
      logFileTeam.players.map((p, i) => [i, false]),
    );
    // create a starter to populate later
    logFileTeam.players.forEach((logFilePlayer, index) => {
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
              leaderboardIDLookupTable[soloData[k].members[0].faction][
                logFileTeam.players.length - 1
              ];
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
        while (logFilePlayerId < logFileTeam.players.length) {
          const logFilePlayerRelicId = parseInt(logFileTeam.players[logFilePlayerId].relicID, 10);
          if (teamStatMemberRelicId === logFilePlayerRelicId) {
            foundMember = true;
            matchedLogFilePlayers[statGroupMemberId] = logFileTeam.players[logFilePlayerId];
            logFilePlayerId = logFileTeam.players.length;
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
      const validIds = teamLeaderboardIdsLookupTable[logFileTeam.side].slice(
        0,
        logFileTeam.players.length - 1,
      );
      if (validIds.includes(leaderboardId)) {
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
    game: LogFileGameData,
  ): Promise<AxiosResponse<PersonalStatResponse>> => {
    const profile_ids = game.left.players
      .concat(game.right.players)
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

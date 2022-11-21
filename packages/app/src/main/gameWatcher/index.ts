import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { ApplicationStore } from "../applicationStore";
import { actions } from "../../redux/slice";
import { notifyGameFound, notifySoundGameFound } from "./notification";
import { locateWarningsFile } from "./locateWarningsDialog";
import { parseLogFileReverse } from "./parseLogFile";
import { refineLogFileData } from "./refineLogFileData";
import { events } from "../mixpanel";
import { Unsubscribe } from "@reduxjs/toolkit";

export class GameWatcher {
  currentIntervalTime: number;
  nodeInterval: NodeJS.Timer;
  lastGameId: string;
  isFirstScan: boolean;
  applicationStore: ApplicationStore;
  unsubscriber: Unsubscribe;

  constructor(applicationStore: ApplicationStore) {
    this.applicationStore = applicationStore;
    this.unsubscriber = this.applicationStore.runtimeStore.subscribe(this.runtimeStoreSubscriber);
    this.isFirstScan = true;
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

    ipcMain.on("reloadStats", () => {
      this.lastGameId = "";
      this.isFirstScan = true; // do not notify
      this.intervalHandler();
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
      parseLogFileReverse(settings.coh2LogFileLocation, this.lastGameId).then((result) => {
        if (result.new) {
          this.lastGameId = result.newGameId;
          // send a notification
          if (!this.isFirstScan && this.applicationStore.getState().settings.gameNotification) {
            notifyGameFound();
          }

          if (!this.isFirstScan && this.applicationStore.getState().settings.soundNotification) {
            notifySoundGameFound(
              this.applicationStore.getState().settings.soundNotificationVolume,
            );
          }

          this.isFirstScan = false;
          refineLogFileData(
            result.game,
            result.newGameId,
            this.applicationStore.getState().cache.mapStats,
          ).then(
            (gameData) => {
              events.new_match_found(gameData.map);
              this.applicationStore.dispatch(actions.setGameData(gameData));
            },
            () => {
              this.lastGameId = ""; // retry in next interval
              this.isFirstScan = true; // do not notify more than once when request fail
            },
          );
        } else {
          const currentGame = this.applicationStore.getState().game;
          if (currentGame.state !== result.game.state) {
            this.applicationStore.dispatch(actions.setGameState(result.game.state));
          }
        }
      });
    }
  };

  protected setInterval(checkInterval: number): void {
    this.nodeInterval = setInterval(this.intervalHandler, checkInterval * 1000);
  }

  protected updateInterval(newCheckInterval: number): void {
    clearInterval(this.nodeInterval);
    this.currentIntervalTime = newCheckInterval;
    this.setInterval(newCheckInterval);
  }

  public destroy(): void {
    this.unsubscriber();
    clearInterval(this.nodeInterval);
  }
}

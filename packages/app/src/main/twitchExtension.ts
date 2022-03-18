import { Unsubscribe } from "@reduxjs/toolkit";
import { ipcMain } from "electron";
import { ApplicationStore } from "./applicationStore";
import { v4 as uuidv4 } from "uuid";
import { GameData, GameState } from "../redux/state";
import crypto from "crypto";
import axios, { AxiosPromise } from "axios";
import config from "./config";
import { actions } from "../redux/slice";
import { events } from "./mixpanel";

export class TwitchExtension {
  lastUniqueGameId: string;
  lastGameState: GameState;
  applicationStore: ApplicationStore;
  unsubscriber: Unsubscribe;

  constructor(applicationStore: ApplicationStore) {
    this.applicationStore = applicationStore;
    this.unsubscriber = this.applicationStore.runtimeStore.subscribe(this.runtimeStoreSubscriber);
    this.lastUniqueGameId = "";
    this.lastGameState = "closed";

    ipcMain.on("configureTwitchExtensionBackend", (event, args) => {
      this.applicationStore.runtimeStore.dispatch(actions.setTwitchExtensionConfigStep(1));
      this.applicationStore.runtimeStore.dispatch(
        actions.setTwitchExtensionConfigStatus("process"),
      );
      const secret = uuidv4();
      this.hashPassword(args, secret)
        .then((passwordHash) => {
          const currentState = this.applicationStore.runtimeStore.getState();
          const currentGameData = currentState.game;
          this.findFreeUUID(passwordHash, currentGameData, 3)
            .then((uuid) => {
              // save settings
              this.applicationStore.runtimeStore.dispatch(
                actions.setTwitchExtensionConfiguration({
                  passwordHash,
                  uuid,
                  secret,
                }),
              );
              this.applicationStore.runtimeStore.dispatch(
                actions.setTwitchExtensionConfigStatus("finish"),
              );
              this.applicationStore.runtimeStore.dispatch(
                actions.setTwitchExtensionConfigStep(2),
              );
            })
            .catch((error) => {
              this.applicationStore.runtimeStore.dispatch(
                actions.setTwitchExtensionConfigStatus("error"),
              );
              events.twitchExtensionConfiguationError("finding uuid and posting data", error);
            });
        })
        .catch((error) => {
          this.applicationStore.runtimeStore.dispatch(
            actions.setTwitchExtensionConfigStatus("error"),
          );
          events.twitchExtensionConfiguationError("password hashing", error);
        });
    });
    ipcMain.on("resetTwitchExtensionBackendConfig", () => {
      this.applicationStore.runtimeStore.dispatch(
        actions.setTwitchExtensionConfiguration({
          passwordHash: "",
          uuid: "",
          secret: "",
        }),
      );
      this.applicationStore.runtimeStore.dispatch(actions.setTwitchExtensionConfigStep(0));
      this.applicationStore.runtimeStore.dispatch(
        actions.setTwitchExtensionConfigStatus("start"),
      );
    });
  }

  protected hashPassword = (password: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      });
    });
  };

  protected findFreeUUID = (
    passwordHash: string,
    firstGameData: GameData,
    attempts: number,
  ): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const generatedUUID = uuidv4() as string;
      this.updateTwitchExtensionData(generatedUUID, passwordHash, firstGameData)
        .then(() => {
          resolve(generatedUUID);
        })
        .catch((error) => {
          reject(error);
        });
    }).catch((error) => {
      if (attempts > 0) {
        return this.findFreeUUID(passwordHash, firstGameData, attempts - 1);
      }
      return Promise.reject(error);
    });
  };

  protected updateTwitchExtensionData = (
    uuid: string,
    passwordHash: string,
    gameData: GameData,
  ): AxiosPromise => {
    const data = JSON.stringify({
      uuid,
      data: { game: gameData },
    });
    return axios({
      method: "POST",
      url: config.twitchExtensionUpdateURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: passwordHash,
      },
      data,
    });
  };

  protected runtimeStoreSubscriber = (): void => {
    /**
     * Update backend data when gameData changes
     */
    const appState = this.applicationStore.runtimeStore.getState();
    if (
      appState.settings.twitchExtension &&
      appState.settings.twitchExtensionConfigStep === 2 &&
      (this.lastUniqueGameId !== appState.game.uniqueId ||
        this.lastGameState !== appState.game.state)
    ) {
      this.lastUniqueGameId = appState.game.uniqueId;
      this.lastGameState = appState.game.state;
      this.updateTwitchExtensionData(
        appState.settings.twitchExtensionUUID,
        appState.settings.twitchExtensionPasswordHash,
        appState.game,
      );
    }
  };

  public destroy(): void {
    this.unsubscriber();
  }
}

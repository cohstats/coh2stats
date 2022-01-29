import { Notification } from "electron";

export const notifyGameFound = (): void => {
  new Notification({
    title: "Found a Game",
    body: "You are joining a game in Coh2",
  }).show();
};

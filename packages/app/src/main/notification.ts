import { Notification } from "electron";
import activeWindows from "electron-active-window";

export const notifyGameFound = (): void => {
  activeWindows()
    .getActiveWindow()
    .then((result: { windowClass: string }) => {
      console.log(result.windowClass);
      if (result.windowClass !== "RelicCoH2.exe") {
        console.log("passed2");
        new Notification({
          title: "Found a Game",
          body: "You are joining a game in Coh2",
          urgency: "critical",
          silent: false,
        }).show();
      }
    });
};

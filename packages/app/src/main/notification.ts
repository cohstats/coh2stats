import { Notification } from "electron";
import { optionalRequire } from "optional-require";

export const notifyGameFound = (): void => {
  const activeWindows = optionalRequire("electron-active-window", true);
  if (activeWindows) {
    try {
      activeWindows()
        .getActiveWindow()
        .then((result: { windowClass: string }) => {
          if (result.windowClass !== "RelicCoH2.exe") {
            new Notification({
              title: "Found a Game",
              body: "You are joining a game in Coh2",
            }).show();
          }
        });
    } catch {
      console.log("Active window did not work!");
    }
  } else {
    console.log("active window was false");
  }
};

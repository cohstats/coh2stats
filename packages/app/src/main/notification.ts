import { Notification } from "electron";
import activeWindows from "electron-active-window";

export const notifyGameFound = () => {
    activeWindows().getActiveWindow().then((result: {windowClass: string}) => {
        if (result.windowClass !== "RelicCoH2.exe") {
            new Notification({ title: "Found a Game", body: "You are joining a game in Coh2"}).show();
        }
    });
}
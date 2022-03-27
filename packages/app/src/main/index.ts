import { app, BrowserWindow } from "electron";
import { ApplicationStore } from "./applicationStore";
import { GameWatcher } from "./gameWatcher";
import { ApplicationManager } from "./applicationManager";
import { StreamerOverlay } from "./streamerOverlay";
import { events } from "./mixpanel";
import { TwitchExtension } from "./twitchExtension";

// manages file and runtime (redux) storage for main
const applicationStore = new ApplicationStore();

let logFileWatcher: GameWatcher;
let applicationManager: ApplicationManager;
let streamerOverlay: StreamerOverlay;
let twitchExtension: TwitchExtension;

if (process.platform !== "win32") {
  // do not start if not windows platform
  app.quit();
}

const squirrelSetupCommand = process.argv[1];
if (squirrelSetupCommand === "--squirrel-updated") {
  // called on the updated version
  app.quit();
}
if (squirrelSetupCommand === "--squirrel-install") {
  // on first time install
  events.install(() => {
    app.quit();
  });
}
if (squirrelSetupCommand === "--squirrel-uninstall") {
  // called when uninstalling
  events.uninstall(() => {
    app.quit();
  });
}
if (squirrelSetupCommand === "--squirrel-obsolete") {
  // called on the version that gets overridden by the new version
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  applicationStore.initializeRuntimeStore();
  logFileWatcher = new GameWatcher(applicationStore);
  applicationManager = new ApplicationManager(applicationStore);
  streamerOverlay = new StreamerOverlay(applicationStore);
  twitchExtension = new TwitchExtension(applicationStore);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // not meant for OS X anyways
  }
});

app.on("window-all-closed", (e: { preventDefault: () => void }) => e.preventDefault());

app.on("quit", () => {
  console.log("App is quiting");
  twitchExtension.destroy();
  streamerOverlay.destroy();
  applicationManager.destroy();
  logFileWatcher.destroy();
  applicationStore.destroy();
});

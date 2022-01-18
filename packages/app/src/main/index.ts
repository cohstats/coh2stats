import { app, BrowserWindow, ipcMain } from 'electron';
import { ReduxStore, defaultSettings, initialState, slice, startupMatchData } from '../redux/slice';
import { configureMainStore } from '../redux/configureStoreMain';
//import { createTrayIcon } from "./tray";
//import { openMatchWindow } from "./windows";
import { ApplicationStore } from './electronStore';
import { ApplicationSettings, ApplicationState } from '../redux/state';
import { GameWatcher } from './logFileWatcher';
import { ApplicationManager } from './windows';

// manages file and runtime (redux) storage for main
const applicationStore = new ApplicationStore();
let logFileWatcher: GameWatcher;
let applicationManager: ApplicationManager;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  applicationStore.initializeRuntimeStore();
  logFileWatcher = new GameWatcher(applicationStore);
  applicationManager = new ApplicationManager(applicationStore);
  //createTrayIcon();
  //openMatchWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
/*app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); */

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    //openMatchWindow();
  }
});

app.on("quit", () => {
  console.log("App is quiting");
  applicationManager.destroy();
  logFileWatcher.destroy();
  applicationStore.destroy();
});

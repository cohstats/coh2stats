import { configureStore, EnhancedStore, Middleware } from "@reduxjs/toolkit";
import { BrowserWindow, ipcMain } from "electron";
import applicationReducer from "./slice";
import { ApplicationState } from "./state";

export const configureMainStore = (initialState: ApplicationState): EnhancedStore => {
  // middleware that sends updates to renderers
  const forwardToRenderer: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    const browserWindows = BrowserWindow.getAllWindows();
    browserWindows.forEach((browserwindow) => {
      browserwindow.webContents.send("ReduxUpdate", store.getState());
    });
    return result;
  };
  const store = configureStore({
    reducer: applicationReducer,
    preloadedState: initialState,
    middleware: [forwardToRenderer],
  });
  // listen to init requests from renderer
  ipcMain.on("ReduxInitialize", (event) => {
    event.sender.send("ReduxUpdate", store.getState());
  });
  // listen to dispatch calls from renderer
  ipcMain.on("ReduxDispatch", (event, args) => {
    store.dispatch(args);
  });
  return store;
};

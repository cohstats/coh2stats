import { configureStore, EnhancedStore, Middleware, Reducer } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import applicationReducer, { initialState } from "./slice";
import { ApplicationState } from "./state";

export const configureRendererStore = (): EnhancedStore => {
  // intercept dispatch from renderer and send to main
  const forwardToMain: Middleware = (store) => (next) => (action) => {
    if (action.type !== "ReduxUpdate") {
      ipcRenderer.send("ReduxDispatch", action);
    } else {
      return next(action);
    }
  };
  const updateableReducer: Reducer<ApplicationState> = (state, action) => {
    if (action.type === "ReduxUpdate") {
      return action.payload;
    } else {
      return applicationReducer(state, action);
    }
  };
  const store = configureStore({
    reducer: updateableReducer,
    preloadedState: initialState,
    middleware: [forwardToMain],
  });
  // send request for initial state
  ipcRenderer.send("ReduxInitialize");
  // listen to updates from main
  ipcRenderer.on("ReduxUpdate", (event, args: ApplicationState) => {
    store.dispatch({
      type: "ReduxUpdate",
      payload: args,
    });
  });

  return store;
};

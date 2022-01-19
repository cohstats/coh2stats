import { AnyAction, configureStore, Dispatch, EnhancedStore, Middleware } from "@reduxjs/toolkit";
import { forwardToRenderer, triggerAlias, replayActionMain } from "electron-redux";
import applicationReducer from "./slice";
import { ApplicationState } from "./state";

export const configureMainStore = (
  initialState: ApplicationState,
): EnhancedStore<ApplicationState, AnyAction, Middleware<any, any, Dispatch<AnyAction>>[]> => {
  const store = configureStore({
    reducer: applicationReducer,
    preloadedState: initialState,
    middleware: [triggerAlias, forwardToRenderer],
  });
  replayActionMain(store);
  return store;
};

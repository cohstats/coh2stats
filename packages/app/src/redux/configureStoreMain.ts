import { configureStore } from "@reduxjs/toolkit";
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import applicationReducer from "./slice";
import { ApplicationState } from "./state";

export const configureMainStore = (initialState: ApplicationState) => {
  const store = configureStore({
    reducer: applicationReducer,
    preloadedState: initialState,
    middleware: [
      triggerAlias,
      forwardToRenderer
    ]
  });
  replayActionMain(store);
  return store;
}

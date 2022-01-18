import { configureStore } from "@reduxjs/toolkit";
import { forwardToMain, replayActionRenderer } from 'electron-redux';
import applicationReducer from "./slice";
import { ApplicationState } from "./state";

export const configureRendererStore = () => {
  const store = configureStore({
    reducer: applicationReducer,

    middleware: [
      forwardToMain
    ]
  });

  replayActionRenderer(store);

  return store;
}

import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { forwardToMain, replayActionRenderer } from "electron-redux";
import applicationReducer from "./slice";

export const configureRendererStore = (): EnhancedStore => {
  const store = configureStore({
    reducer: applicationReducer,

    middleware: [forwardToMain],
  });

  replayActionRenderer(store);

  return store;
};

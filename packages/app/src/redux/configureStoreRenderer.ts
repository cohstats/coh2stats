import { AnyAction, configureStore, Dispatch, EnhancedStore, Middleware } from "@reduxjs/toolkit";
import { forwardToMain, replayActionRenderer } from "electron-redux";
import applicationReducer from "./slice";
import { ApplicationState } from "./state";

export const configureRendererStore = (): EnhancedStore<
  ApplicationState,
  AnyAction,
  Middleware<any, any, Dispatch<AnyAction>>[]
> => {
  const store = configureStore({
    reducer: applicationReducer,

    middleware: [forwardToMain],
  });

  replayActionRenderer(store);

  return store;
};

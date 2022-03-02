import { init } from "mixpanel";
import config from "./config";
import { machineIdSync } from "node-machine-id";
import { app } from "electron";
import { ApplicationSettings, ApplicationState, ApplicationWindows } from "../redux/state";

const mixpanel = init(config.mixpanelProjectToken);

// Generates anonymous unique ID / machine, so we can distinguish between users
const clientId = machineIdSync(true);

const events = {
  install: (onEventSent: () => void): void => {
    mixpanel.track(
      "app_install",
      {
        distinct_id: clientId,
        version: app.getVersion(),
      },
      onEventSent,
    );
  },
  uninstall: (onEventSent: () => void): void => {
    mixpanel.track(
      "app_uninstall",
      {
        distinct_id: clientId,
        version: app.getVersion(),
      },
      onEventSent,
    );
  },
  init: (): void => {
    mixpanel.track("app_init", {
      distinct_id: clientId,
      version: app.getVersion(),
    });
  },
  new_match_found: (map: string): void => {
    mixpanel.track("new_match_found", {
      distinct_id: clientId,
      map: map,
    });
  },
  open_window: (windowName: ApplicationWindows): void => {
    mixpanel.track(windowName + "_open", {
      distinct_id: clientId,
    });
  },
  close_window: (windowName: ApplicationWindows, openTime: number): void => {
    mixpanel.track(windowName + "_close", {
      distinct_id: clientId,
      open_time: openTime,
    });
  },
  click_on_player: (type: string): void => {
    mixpanel.track("open_player_profile", {
      distinct_id: clientId,
      type: type,
    });
  },
  app_quit: (settings: ApplicationSettings, runtime: number, onEventSent: () => void): void => {
    mixpanel.track(
      "app_quit",
      {
        distinct_id: clientId,
        settings: settings,
        runtime: runtime,
      },
      onEventSent,
    );
  },
  error: (
    error: Error,
    origin: NodeJS.UncaughtExceptionOrigin,
    applicationState: ApplicationState,
  ): void => {
    mixpanel.track("app_error", {
      distinct_id: clientId,
      error: error,
      origin: origin,
      applicationState: applicationState,
    });
  },
};

export { events };

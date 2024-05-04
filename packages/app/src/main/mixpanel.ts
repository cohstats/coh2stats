import { init } from "mixpanel";
import config from "./config";
import { machineIdSync } from "node-machine-id";
import { app } from "electron";
import { release } from "os";
import { ApplicationSettings, ApplicationWindows } from "../redux/state";

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
        os_version: release(),
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
        os_version: release(),
      },
      onEventSent,
    );
  },
  init: (): void => {
    mixpanel.track("app_init", {
      distinct_id: clientId,
      version: app.getVersion(),
      os_version: release(),
    });
  },
  new_match_found: (map: string): void => {
    mixpanel.track("new_match_found", {
      distinct_id: clientId,
      map: map,
      os_version: release(),
    });
  },
  open_window: (windowName: ApplicationWindows): void => {
    mixpanel.track(windowName + "_open", {
      distinct_id: clientId,
      os_version: release(),
    });
  },
  close_window: (windowName: ApplicationWindows, openTime: number): void => {
    mixpanel.track(windowName + "_close", {
      distinct_id: clientId,
      open_time: openTime,
      os_version: release(),
    });
  },
  click_on_player: (type: string): void => {
    mixpanel.track("open_player_profile", {
      distinct_id: clientId,
      type: type,
      os_version: release(),
    });
  },
  app_quit: (settings: ApplicationSettings, runtime: number, onEventSent: () => void): void => {
    mixpanel.track(
      "app_quit",
      {
        distinct_id: clientId,
        settings: {
          ...settings,
          coh2LogFileLocation: "",
          twitchExtensionPasswordHash: "",
          twitchExtensionUUID: "",
          twitchExtensionSecret: "",
        },
        runtime: runtime,
        os_version: release(),
      },
      onEventSent,
    );
  },
  error: (
    error: Error,
    origin: NodeJS.UncaughtExceptionOrigin,
    settings: ApplicationSettings,
    onEventSent: () => void,
  ): void => {
    mixpanel.track(
      "app_error",
      {
        distinct_id: clientId,
        stack: error.stack,
        name: error.name,
        message: error.message,
        origin: origin,
        settings: {
          ...settings,
          coh2LogFileLocation: "",
          twitchExtensionPasswordHash: "",
          twitchExtensionUUID: "",
          twitchExtensionSecret: "",
        },
        os_version: release(),
      },
      onEventSent,
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  twitchExtensionConfiguationError: (step: string, error: any): void => {
    mixpanel.track("twitch_extension_config_error", {
      distinct_id: clientId,
      errorStep: step,
      error,
      os_version: release(),
    });
  },
};

export { events };

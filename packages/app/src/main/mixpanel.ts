import { init } from "mixpanel";
import config from "./config";
import { machineIdSync } from "node-machine-id";
import { app } from "electron";

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
  about_open: (): void => {
    mixpanel.track("about_open", {
      distinct_id: clientId,
    });
  },
  settings_open: (): void => {
    mixpanel.track("settings_open", {
      distinct_id: clientId,
    });
  },
  click_on_player: (type: string): void => {
    mixpanel.track("open_player_profile", {
      distinct_id: clientId,
      type: type,
    });
  },
};

export { events };

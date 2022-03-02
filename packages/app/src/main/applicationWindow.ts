import { BrowserWindow, Menu, screen } from "electron";
import { ApplicationWindows, WindowState } from "../redux/state";
import { isPackaged } from "electron-is-packaged";
import { getIconPath } from "./paths";
import { events } from "./mixpanel";

export interface ApplicationWindowOptions {
  minWidth: number;
  minHeight: number;
  displayExternalContent: boolean;
  preload?: string;
  maximizable: boolean;
  fullscreenable: boolean;
  resizable: boolean;
  url: string;
  closeHandlerCreator: WindowCloseHandlerCreator;
  getLastWindowSateFunc: (windowName: ApplicationWindows) => WindowState;
}

export type WindowCloseHandlerCreator = (
  windowName: ApplicationWindows,
  window: BrowserWindow,
) => (event: Electron.Event) => void;

export class ApplicationWindow {
  options: ApplicationWindowOptions;
  name: ApplicationWindows;
  window: BrowserWindow | undefined;
  startTime: number;

  constructor(windowName: ApplicationWindows, options: ApplicationWindowOptions) {
    this.options = options;
    this.name = windowName;
  }

  exists = (): boolean => {
    return !(!this.window || this.window.isDestroyed());
  };

  show = (url?: string): void => {
    if (!this.exists() && (!this.options.displayExternalContent || url)) {
      this.startTime = new Date().getTime();
      events.open_window(this.name);
      const windowState = this.options.getLastWindowSateFunc(this.name);
      const validWindowState = this.getValidWindowSpawn(windowState);
      this.window = new BrowserWindow({
        icon: getIconPath(),
        x: validWindowState.x,
        y: validWindowState.y,
        width: this.options.resizable ? validWindowState.width : windowState.width,
        height: this.options.resizable ? validWindowState.height : windowState.height,
        minHeight: this.options.minHeight,
        minWidth: this.options.minWidth,
        resizable: this.options.resizable,
        maximizable: this.options.maximizable,
        fullscreenable: this.options.fullscreenable,
        frame: this.options.displayExternalContent,
        webPreferences: {
          preload: this.options.preload,
          // This disables ability to use NODE functions in the render process
          // it's important for firebase to work
          nodeIntegration: false,
        },
      });
      this.window.setMenu(Menu.buildFromTemplate([]));
      this.window.loadURL(this.options.displayExternalContent ? url : this.options.url);
      if (!isPackaged) {
        this.window.webContents.openDevTools({
          mode: "detach",
        });
      }
      this.window.on("close", this.options.closeHandlerCreator(this.name, this.window));
      if (validWindowState.maximized && this.options.maximizable) {
        this.window.maximize();
      }
    }
    this.window.focus();
  };

  getBounds = (): Electron.Rectangle | undefined => {
    if (this.exists()) {
      return this.window.getBounds();
    }
    console.error("Cant get window bounds since it is closed!");
    return undefined;
  };

  minimize = (): void => {
    if (this.exists()) {
      this.window.minimize();
    }
  };

  toggleMaximize = (): void => {
    if (this.exists()) {
      if (this.window.isMaximized()) {
        this.window.unmaximize();
      } else {
        this.window.maximize();
      }
    }
  };

  close = (): void => {
    if (this.exists()) {
      events.close_window(this.name, new Date().getTime() - this.startTime);
      this.window.close();
    }
  };

  destroy = (): void => {
    if (this.exists()) {
      this.window.destroy();
    }
  };

  protected getValidWindowSpawn(windowState: WindowState): WindowState {
    const displays = screen.getAllDisplays();
    let lastStateIsValid = true;
    if (windowState.x && windowState.y) {
      displays.forEach((display) => {
        if (!this.isWithinDisplayBounds(windowState, display.bounds)) {
          lastStateIsValid = false;
        }
      });
    } else {
      lastStateIsValid = false;
    }
    if (lastStateIsValid) {
      return windowState;
    } else {
      const spawnDisplayBounds = this.getSpawnDisplayBounds();
      return {
        x: spawnDisplayBounds.x + spawnDisplayBounds.width / 2 - windowState.width / 2,
        y: spawnDisplayBounds.y + spawnDisplayBounds.height / 2 - windowState.height / 2,
        width:
          windowState.width > spawnDisplayBounds.width
            ? spawnDisplayBounds.width
            : windowState.width,
        height:
          windowState.height > spawnDisplayBounds.height
            ? spawnDisplayBounds.height
            : windowState.height,
        maximized: windowState.maximized,
      };
    }
  }

  protected isWithinDisplayBounds(windowState: WindowState, bounds: Electron.Rectangle): boolean {
    return (
      windowState.x &&
      windowState.y &&
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  }

  protected getSpawnDisplayBounds(): Electron.Rectangle {
    const displays = screen.getAllDisplays();
    let displayBounds: undefined | Electron.Rectangle = undefined;
    displays.forEach((display) => {
      if (!displayBounds) {
        displayBounds = display.bounds;
      }
      if (display.bounds.x !== 0 || display.bounds.y !== 0) {
        displayBounds = display.bounds;
      }
    });
    return displayBounds;
  }
}

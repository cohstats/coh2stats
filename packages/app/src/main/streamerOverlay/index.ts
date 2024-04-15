import { ApplicationStore } from "../applicationStore";
import { Server } from "http";
import net from "net";
import * as socketIo from "socket.io";
import tcpPortUsed from "tcp-port-used";
import { getAntdDistPath, getAssetsPath } from "../paths";
import express, { Request, Response, NextFunction } from "express";
import { renderHtml } from "./renderHtml";
import { actions } from "../../redux/slice";
import { Unsubscribe } from "@reduxjs/toolkit";

export class StreamerOverlay {
  expressServer: Server;
  socketIoServer: socketIo.Server;
  running: boolean;
  currentPort: number;
  applicationStore: ApplicationStore;
  unsubscriber: Unsubscribe;

  constructor(applicationStore: ApplicationStore) {
    this.applicationStore = applicationStore;
    this.unsubscriber = this.applicationStore.runtimeStore.subscribe(this.runtimeStoreSubscriber);
    const settings = this.applicationStore.getState().settings;
    if (settings.streamOverlay) {
      this.currentPort = settings.streamOverlayPort;
      this.start();
    }
  }

  protected runtimeStoreSubscriber = (): void => {
    const settings = this.applicationStore.getState().settings;
    if (settings.streamOverlay) {
      if (this.running && this.currentPort !== settings.streamOverlayPort) {
        console.debug(
          `Stream overlay - change of port - Starting stream overlay server on port ${settings.streamOverlayPort}`,
        );
        this.stop();
        this.start();
      } else if (!this.running) {
        console.debug(
          `Stream overlay not running - Starting stream overlay server on port ${settings.streamOverlayPort}`,
        );
        this.start();
      }
      if (this.running) {
        this.socketIoServer.sockets.emit("broadcast", { type: "reloadPage" });
      }
    } else {
      this.stop();
    }
  };

  protected start = async (): Promise<void> => {
    const port = this.applicationStore.getState().settings.streamOverlayPort;
    tcpPortUsed.check(port, "127.0.0.1").then((inUse) => {
      if (inUse) {
        this.applicationStore.dispatch(actions.setStreamOverlayPortFree(false));
      } else {
        const app = express();
        app.use("/assets", express.static(getAssetsPath()));
        app.use("/antd", express.static(getAntdDistPath()));
        app.use("/", this.renderPage);
        this.expressServer = app.listen(port, () => {
          console.log(`Stream overlay server is running! http://localhost:${port}`);
        });
        this.socketIoServer = new socketIo.Server(this.expressServer);
        this.socketIoServer.on("connection", (socket) => {
          console.log("New stream overlay client connected");
          socket.on("disconnect", () => {
            console.log("Stream overlay client disconnected");
          });
        });
        this.currentPort = port;
        this.running = true;
        this.applicationStore.dispatch(actions.setStreamOverlayPortFree(true));
      }
    });
  };

  protected isPortFree = (port: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const server = net.createServer((socket) => {
        socket.write("Echo server \r\n");
        socket.pipe(socket);
      });

      server.on("error", (error) => {
        this.applicationStore.dispatch(actions.setStreamOverlayPortFree(false));
        reject();
      });
      server.on("listening", () => {
        server.close();
        this.applicationStore.dispatch(actions.setStreamOverlayPortFree(true));
        resolve();
      });
      server.listen(port, "localhost");
    });
  };

  protected renderPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.send(renderHtml(this.applicationStore.getState()));
    } catch (error) {
      next(error);
    }
  };

  protected stop(): void {
    if (this.running) {
      console.debug(`Stopping stream overlay server on port ${this.currentPort}`);
      this.socketIoServer.close();
      this.expressServer.close();
    }
    this.running = false;
  }

  public destroy(): void {
    this.stop();
    this.unsubscriber();
  }
}

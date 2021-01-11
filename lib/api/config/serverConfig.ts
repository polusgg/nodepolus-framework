import { LogLevel } from "../../logger/logger";

export type ServerConfig = {
  serverAddress?: string;
  serverPort?: number;
  defaultLobbyAddress?: string;
  defaultLobbyPort?: number;
  logging?: {
    consoleLevel?: LogLevel;
    maxFileSizeInBytes?: number;
    maxFiles?: number;
    filename?: string;
  };
};

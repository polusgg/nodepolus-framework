import { LogLevel } from "../../logger/logger";

export type ServerConfig = {
  /**
   * The address that NodePolus will bind to.
   *
   * @defaultValue `0.0.0.0`
   */
  serverAddress?: string;
  /**
   * The port that NodePolus will listen on.
   *
   * @defaultValue `22023`
   */
  serverPort?: number;
  /**
   * The default address that a lobby will bind to.
   *
   * @defaultValue `0.0.0.0`
   */
  defaultLobbyAddress?: string;
  /**
   * The default port that a lobby will listen on.
   *
   * @defaultValue `22023`
   */
  defaultLobbyPort?: number;
  /**
   * Logger configuration.
   */
  logging?: {
    /**
     * The maximum level of log messages to be logged to the console and log file.
     *
     * @defaultValue `info`
     *
     * Options: `fatal`, `error`, `warn`, `info`, `verbose`, `debug`, `trace`
     */
    consoleLevel?: LogLevel;
    /**
     * The maximum size in bytes for the server log file before it is rotated.
     *
     * @defaultValue `104857600`
     */
    maxFileSizeInBytes?: number;
    /**
     * The maximum number of log files to keep.
     *
     * @defaultValue `10`
     */
    maxFiles?: number;
    /**
     * The name of the server log file.
     *
     * @defaultValue `server.log`
     */
    filename?: string;
  };
};

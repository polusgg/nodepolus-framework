import { LogLevel } from "../../logger/logger";

/**
 * A type used to describe the structure of the NodePolus server configuration.
 */
export type ServerConfig = {
  /**
   * The IP address that NodePolus will bind to.
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
   * Whether or not to run the announcement server alongside the region server.
   *
   * @defaultValue `false`
   */
  enableAnnouncementServer?: boolean;
  /**
   * The maximum number of lobbies that the server will host at a time.
   *
   * @defaultValue `100000`
   */
  maxLobbies?: number;
  /**
   * The maximum number of connections allowed per IP address.
   *
   * @defaultValue `10`
   */
  maxConnectionsPerAddress?: number;
  /**
   * Lobby configuration.
   */
  lobby?: {
    /**
     * The default address that a lobby will bind to.
     *
     * @defaultValue `0.0.0.0`
     */
    defaultAddress?: string;
    /**
     * The default port that a lobby will listen on.
     *
     * @defaultValue `22023`
     */
    defaultPort?: number;
    /**
     * The maximum number of players that the server will allow in a lobby.
     *
     * @defaultValue `10`
     */
    maxPlayers?: number;
    /**
     * Whether all players in a lobby will be given acting host.
     *
     * TODO: Find a better name for this
     *
     * @defaultValue `false`
     */
    allHosts?: boolean;
  };
  /**
   * Logger configuration.
   */
  logging?: {
    /**
     * The maximum level of log messages to be displayed in the console and
     * written to the log file.
     *
     * Options: `fatal`, `error`, `warn`, `info`, `verbose`, `debug`, `trace`
     *
     * @defaultValue `info`
     */
    level?: LogLevel;
    /**
     * The name of the server log file.
     *
     * @defaultValue `server.log`
     */
    filename?: string;
    /**
     * The maximum size in bytes for the server log file before it is rotated.
     *
     * @defaultValue `104857600` (100 MB)
     */
    maxFileSizeInBytes?: number;
    /**
     * The maximum number of log files to keep.
     *
     * @defaultValue `10`
     */
    maxFiles?: number;
  };
};

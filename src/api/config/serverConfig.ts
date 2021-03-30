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
     * The default time, in seconds, until the game starts after a host clicks
     * the Play button.
     *
     * @defaultValue `5`
     */
    defaultStartTimerDuration?: number;
    /**
     * The default time, in seconds, before a lobby is automatically closed if
     * no players have joined.
     *
     * @defaultValue `5`
     */
    defaultTimeToJoinUntilClosed?: number;
    /**
     * The default time, in seconds, before a lobby is automatically closed if
     * a game has not been started.
     *
     * @defaultValue `600` (10 minutes)
     */
    defaultTimeToStartUntilClosed?: number;
    /**
     * The maximum number of players that the server will allow in a lobby.
     *
     * @defaultValue `10`
     */
    maxPlayers?: number;
    /**
     * Whether or not chat messages from dead players should be sent to players
     * that are still alive.
     *
     * Chat messages from dead players will never be displayed in-game to
     * players that are still alive. The Innersloth servers still relay chat
     * packets from dead players to players that are still alive; this option
     * is here to provide the ability to mirror the official servers (by setting
     * it to `false`).
     *
     * @defaultValue `true`
     */
    hideGhostChat?: boolean;
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
  /**
   * Plugin configurations.
   *
   * For plugins installed via NPM packages, use the package name for the key.
   *
   * @example
   * ```
   * "plugins": {
   *   "nodepolus-simple-anticheat": {
   *     "prevent-killing-as-crewmate": true
   *   }
   * }
   * ```
   *
   * For plugins installed in the `bin/plugins` folder, use the folder name for
   * the key.
   *
   * @example
   * ```
   * "plugins": {
   *   "simpleAnticheat.npplugin": {
   *     "prevent-killing-as-crewmate": true
   *   }
   * }
   * ```
   */
  plugins?: Record<string, Record<string, unknown>>;
};

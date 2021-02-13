import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";

/**
 * Fired when a connection is attempting to get a list of public lobbies.
 */
export class ServerLobbyListEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that is requesting a list of games
   * @param includePrivateLobbies - `true` if the connection wants private games included in the results, `false` if not
   * @param lobbies - The lobbies that will be sent to the connection
   * @param lobbyCounts - The lobby counts for each level that will be sent to the connection
   */
  constructor(
    private readonly connection: Connection,
    private readonly includePrivateLobbies: boolean,
    private lobbies: LobbyListing[],
    private lobbyCounts?: LobbyCount,
  ) {
    super(DisconnectReason.custom("The server refused to list its public games"));
  }

  /**
   * Gets the connection that is requesting a list of games.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets whether or not the connection wants private games included in the results.
   *
   * @returns `true` if private games were requested, `false` if not
   */
  wantsPrivateLobbies(): boolean {
    return this.includePrivateLobbies;
  }

  /**
   * Gets the lobbies that will be sent to the connection.
   */
  getLobbies(): LobbyListing[] {
    return this.lobbies;
  }

  /**
   * Sets the lobbies that will be sent to the connection.
   *
   * @param lobbies - The new lobbies that will be sent to the connection.
   */
  setLobbies(lobbies: LobbyListing[]): void {
    this.lobbies = lobbies;
  }

  /**
   * Gets the lobby counts for each level that will be sent to the connection.
   *
   * @returns The lobby counts for each level that will be sent to the connection, or `undefined` if no counts will be sent
   */
  getLobbyCounts(): LobbyCount | undefined {
    return this.lobbyCounts;
  }

  /**
   * Sets the lobby counts for each level that will be sent to the connection.
   *
   * @param lobbyCounts - The new lobby counts that will be sent to the connection, or `undefined` if no counts should be sent
   */
  setLobbyCounts(lobbyCounts?: LobbyCount): void {
    this.lobbyCounts = lobbyCounts;
  }
}

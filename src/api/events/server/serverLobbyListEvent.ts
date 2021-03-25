import { DisconnectReason, LobbyListing } from "../../../types";
import { Connection } from "../../../protocol/connection";
import { DisconnectableEvent } from "../types";

/**
 * Fired when a connection is attempting to get a list of public lobbies.
 */
export class ServerLobbyListEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that is requesting a list of games
   * @param includePrivateLobbies - `true` if the connection wants private games included in the results, `false` if not
   * @param lobbies - The lobbies that will be sent to the connection
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly includePrivateLobbies: boolean,
    protected lobbies: LobbyListing[],
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
  setLobbies(lobbies: LobbyListing[]): this {
    this.lobbies = lobbies;

    return this;
  }
}

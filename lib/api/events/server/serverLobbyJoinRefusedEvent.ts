import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { CancellableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a connection tries to join a lobby that is full.
 */
export class ServerLobbyJoinRefusedEvent extends CancellableEvent {
  /**
   * @param connection - The connection that the lobby refused to allow to join
   * @param lobby - The lobby that refused the connection
   * @param disconnectReason - The disconnect reason to be sent to the connection (default `GameFull`)
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly lobby: LobbyInstance,
    protected disconnectReason: DisconnectReason = DisconnectReason.gameFull(),
  ) {
    super();
  }

  /**
   * Gets the connection that the lobby refused to allow to join.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the lobby that refused the connection.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the disconnect reason to be sent to the connection.
   */
  getDisconnectReason(): DisconnectReason {
    return this.disconnectReason;
  }

  /**
   * Sets the disconnect reason to be sent to the connection.
   *
   * @param disconnectReason - The new disconnect reason to be sent to the conection
   */
  setDisconnectReason(disconnectReason: DisconnectReason): this {
    this.disconnectReason = disconnectReason;

    return this;
  }
}

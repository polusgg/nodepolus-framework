import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { CancellableEvent } from "../types";

/**
 * Fired when a connection tries to create a lobby while the server is full.
 */
export class ServerLobbyCreatedRefusedEvent extends CancellableEvent {
  /**
   * @param connection - The connection for which the server refused to create a lobby
   * @param disconnectReason - The disconnect reason to be sent to the connection (default `ServerFull`)
   */
  constructor(
    protected readonly connection: Connection,
    protected disconnectReason: DisconnectReason = DisconnectReason.serverFull(),
  ) {
    super();
  }

  /**
   * Gets the connection for which the server refused to create a lobby.
   */
  getConnection(): Connection {
    return this.connection;
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

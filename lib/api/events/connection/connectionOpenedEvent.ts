import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";

/**
 * Fired when a connection to the server has been initialized with a Hello
 * packet.
 */
export class ConnectionOpenedEvent extends DisconnectableEvent {
  constructor(
    private readonly connection: Connection,
  ) {
    super(DisconnectReason.custom("The server refused your connection"));
  }

  /**
   * Gets the connection that was opened.
   */
  getConnection(): Connection {
    return this.connection;
  }
}

import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { MessageReader } from "../../../util/hazelMessage";

/**
 * Fired when a connection to the server has been initialized with a Hello
 * packet.
 */
export class ConnectionOpenedEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that was opened
   * @param reader - Any extra data sent by the connection
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly reader: MessageReader,
  ) {
    super(DisconnectReason.custom("The server refused your connection"));
  }

  /**
   * Gets the connection that was opened.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the reader containing any extra data in the hello.
   */
  getReader(): MessageReader {
    return this.reader;
  }
}

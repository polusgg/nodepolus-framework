import { BaseRootPacket } from "../../../protocol/packets/root";
import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "../types";

/**
 * Fired when a root packet defined in the base protocol has been sent to a
 * connection.
 */
export class ServerPacketOutEvent extends CancellableEvent {
  /**
   * @param connection - The connection to which the packet was sent
   * @param packet - The packet that was sent
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly packet: BaseRootPacket,
  ) {
    super();
  }

  /**
   * Gets the connection to which the packet was sent.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the packet that was sent.
   */
  getPacket(): BaseRootPacket {
    return this.packet;
  }
}

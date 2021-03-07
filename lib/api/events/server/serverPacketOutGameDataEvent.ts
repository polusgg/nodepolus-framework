import { BaseGameDataPacket } from "../../../protocol/packets/gameData";
import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "../types";

/**
 * Fired when a GameData packet defined in the base protocol has been sent to a
 * connection.
 */
export class ServerPacketOutGameDataEvent extends CancellableEvent {
  /**
   * @param connection - The connection to which the packet was sent
   * @param packet - The GameData packet that was sent
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly packet: BaseGameDataPacket,
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
   * Gets the GameData packet that was sent.
   */
  getPacket(): BaseGameDataPacket {
    return this.packet;
  }
}

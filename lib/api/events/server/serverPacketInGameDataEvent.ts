import { BaseGameDataPacket } from "../../../protocol/packets/gameData";
import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "../types";

/**
 * Fired when a connection sends a GameData packet defined in the base protocol.
 */
export class ServerPacketInGameDataEvent extends CancellableEvent {
  /**
   * @param connection - The connection that sent the packet
   * @param packet - The GameData packet that was sent
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly packet: BaseGameDataPacket,
  ) {
    super();
  }

  /**
   * Gets the connection that sent the packet.
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

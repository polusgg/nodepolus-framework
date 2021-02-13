import { BaseInnerNetObject } from "../../../protocol/entities/types";
import { BaseRpcPacket } from "../../../protocol/packets/rpc";
import { Connection } from "../../../protocol/connection";

/**
 * Fired when a connection sends an RPC packet not defined in the base protocol.
 */
export class ServerPacketRpcCustomEvent {
  /**
   * @param connection - The connection that sent the packet
   * @param netId - The ID of the InnerNetObject that sent the packet
   * @param sender - The InnerNetObject that sent the packet
   * @param packet - The RPC packet that was sent
   */
  constructor(
    private readonly connection: Connection,
    private readonly netId: number,
    private readonly sender: BaseInnerNetObject | undefined,
    private readonly packet: BaseRpcPacket,
  ) {}

  /**
   * Gets the connection that sent the packet.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the ID of the InnerNetObject that sent the packet.
   */
  getNetId(): number {
    return this.netId;
  }

  /**
   * Gets the InnerNetObject that sent the packet.
   *
   * @returns the InnerNetObject that sent the packet, or `undefined` if it does not exist
   */
  getSender(): BaseInnerNetObject | undefined {
    return this.sender;
  }

  /**
   * Gets the RPC packet that was sent.
   */
  getPacket(): BaseRpcPacket {
    return this.packet;
  }
}

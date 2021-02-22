import { BaseInnerNetObject } from "../../../protocol/entities/baseEntity";
import { BaseRpcPacket } from "../../../protocol/packets/rpc";
import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "../types";

/**
 * Fired when a connection sends an RPC packet not defined in the base protocol.
 */
export class ServerPacketInRpcCustomEvent extends CancellableEvent {
  /**
   * @param connection - The connection that sent the packet
   * @param netId - The ID of the InnerNetObject that sent the packet
   * @param sender - The InnerNetObject that sent the packet
   * @param packet - The RPC packet that was sent
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly netId: number,
    protected readonly sender: BaseInnerNetObject | undefined,
    protected readonly packet: BaseRpcPacket,
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
   * Gets the ID of the InnerNetObject that sent the packet.
   */
  getNetId(): number {
    return this.netId;
  }

  /**
   * Gets the InnerNetObject that sent the packet.
   *
   * @returns The InnerNetObject that sent the packet, or `undefined` if it does not exist
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

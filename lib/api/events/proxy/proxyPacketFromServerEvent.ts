import { BaseRootPacket } from "../../../protocol/packets/root";
import { CancellableEvent } from "../types";

export class ProxyPacketFromServerEvent extends CancellableEvent {
  constructor(
    private packet: BaseRootPacket,
  ) {
    super();
  }

  getPacket(): BaseRootPacket {
    return this.packet;
  }

  setPacket(packet: BaseRootPacket): void {
    this.packet = packet;
  }
}

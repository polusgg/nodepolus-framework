import { BaseRootPacket } from "../../../protocol/packets/root";
import { CancellableEvent } from "..";

export class ProxyPacketFromClientEvent extends CancellableEvent {
  constructor(
    public packet: BaseRootPacket,
  ) {
    super();
  }
}

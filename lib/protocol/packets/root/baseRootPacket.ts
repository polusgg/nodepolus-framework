import { MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";

export abstract class BaseRootPacket {
  constructor(
    protected readonly type: RootPacketType,
  ) {}

  abstract clone(): BaseRootPacket;

  abstract serialize(): MessageWriter;

  getType(): RootPacketType {
    return this.type;
  }
}

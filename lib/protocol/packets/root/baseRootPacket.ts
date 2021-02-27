import { MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { CanSerializeToHazel } from "../../../types";

export abstract class BaseRootPacket implements CanSerializeToHazel {
  constructor(
    protected readonly type: RootPacketType,
  ) {}

  abstract clone(): BaseRootPacket;

  abstract serialize(writer: MessageWriter): void;

  getType(): RootPacketType {
    return this.type;
  }
}

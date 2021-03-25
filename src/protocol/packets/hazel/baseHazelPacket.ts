import { MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";
import { CanSerializeToHazel } from "../../../types";

export abstract class BaseHazelPacket implements CanSerializeToHazel {
  constructor(
    protected readonly type: HazelPacketType,
  ) {}

  abstract clone(): BaseHazelPacket;

  abstract serialize(writer: MessageWriter): void;

  getType(): HazelPacketType {
    return this.type;
  }
}

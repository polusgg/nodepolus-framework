import { MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";

export abstract class BaseHazelPacket {
  constructor(
    protected readonly type: HazelPacketType,
  ) {}

  abstract clone(): BaseHazelPacket;

  abstract serialize(): MessageWriter;

  getType(): HazelPacketType {
    return this.type;
  }
}

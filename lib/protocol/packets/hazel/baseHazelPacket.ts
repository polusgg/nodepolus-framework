import { MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";

export abstract class BaseHazelPacket {
  constructor(
    public type: HazelPacketType,
  ) {}

  abstract clone(): BaseHazelPacket;

  abstract serialize(): MessageWriter;
}

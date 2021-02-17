import { MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../types/enums";

export abstract class BaseRootPacket {
  constructor(
    public type: RootPacketType,
  ) {}

  abstract clone(): BaseRootPacket;

  abstract serialize(): MessageWriter;
}

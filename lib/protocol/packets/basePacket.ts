import { MessageWriter } from "../../util/hazelMessage";
import { PacketType } from "./types";

export abstract class BasePacket {
  type: PacketType;

  constructor(type: PacketType) {
    this.type = type;
  }

  abstract serialize(): MessageWriter;
}

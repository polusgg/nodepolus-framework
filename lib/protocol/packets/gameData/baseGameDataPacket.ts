import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../../../types/enums";

export abstract class BaseGameDataPacket {
  constructor(
    public type: GameDataPacketType,
  ) {}

  abstract clone(): BaseGameDataPacket;

  abstract serialize(): MessageWriter;
}

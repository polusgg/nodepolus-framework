import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../types/enums";

export abstract class BaseGameDataPacket {
  constructor(
    public type: GameDataPacketType,
  ) {}

  abstract serialize(): MessageWriter;
}

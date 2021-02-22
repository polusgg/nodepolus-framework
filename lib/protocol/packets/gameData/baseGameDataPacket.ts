import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../../../types/enums";

export abstract class BaseGameDataPacket {
  constructor(
    protected readonly type: GameDataPacketType,
  ) {}

  abstract clone(): BaseGameDataPacket;

  abstract serialize(): MessageWriter;

  getType(): GameDataPacketType {
    return this.type;
  }
}

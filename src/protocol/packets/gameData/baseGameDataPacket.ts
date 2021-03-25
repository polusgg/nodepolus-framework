import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../../../types/enums";
import { CanSerializeToHazel } from "../../../types";

export abstract class BaseGameDataPacket implements CanSerializeToHazel {
  constructor(
    protected readonly type: GameDataPacketType,
  ) {}

  abstract clone(): BaseGameDataPacket;

  abstract serialize(writer: MessageWriter): void;

  getType(): GameDataPacketType {
    return this.type;
  }
}

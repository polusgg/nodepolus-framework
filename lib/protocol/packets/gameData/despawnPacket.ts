import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../types/enums";

/**
 * Game Data Packet ID: `0x05` (`5`)
 */
export class DespawnPacket extends BaseGameDataPacket {
  constructor(
    public innerNetObjectID: number,
  ) {
    super(GameDataPacketType.Despawn);
  }

  static deserialize(reader: MessageReader): DespawnPacket {
    return new DespawnPacket(reader.readPackedUInt32());
  }

  clone(): DespawnPacket {
    return new DespawnPacket(this.innerNetObjectID);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.innerNetObjectID);
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../../../types/enums";

/**
 * Game Data Packet ID: `0x05` (`5`)
 */
export class DespawnPacket extends BaseGameDataPacket {
  constructor(
    public despawnedNetId: number,
  ) {
    super(GameDataPacketType.Despawn);
  }

  static deserialize(reader: MessageReader): DespawnPacket {
    return new DespawnPacket(reader.readPackedUInt32());
  }

  clone(): DespawnPacket {
    return new DespawnPacket(this.despawnedNetId);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.despawnedNetId);
  }
}

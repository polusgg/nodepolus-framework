import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../../../types/enums";
import { BaseGameDataPacket } from ".";

export class SpawnPacketObject extends BaseGameDataPacket {
  constructor(
    public spawnedNetId: number,
    public data: MessageWriter | MessageReader,
  ) {
    super(GameDataPacketType.Spawn);
  }

  static deserialize(reader: MessageReader): SpawnPacketObject {
    return new SpawnPacketObject(
      reader.readPackedUInt32(),
      reader.readMessage()!,
    );
  }

  clone(): SpawnPacketObject {
    return new SpawnPacketObject(this.spawnedNetId, this.data.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.spawnedNetId)
      .startMessage(1)
      .writeBytes(this.data)
      .endMessage();
  }
}

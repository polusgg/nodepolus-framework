import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnFlag } from "../../../types/spawnFlag";
import { BaseGameDataPacket } from "../basePacket";
import { GameDataPacketType } from "../types";

export class SpawnInnerNetObject extends BaseGameDataPacket {
  constructor(
    public innerNetObjectID: number,
    public data: MessageWriter | MessageReader,
  ) {
    super(GameDataPacketType.Spawn);
  }

  static deserialize(reader: MessageReader): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      reader.readPackedUInt32(),
      reader.readMessage()!,
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.innerNetObjectID)
      .startMessage(1)
      .writeBytes(this.data)
      .endMessage();
  }
}

export class SpawnPacket extends BaseGameDataPacket {
  constructor(
    public spawnType: number,
    public owner: number,
    public flags: SpawnFlag,
    public innerNetObjects: SpawnInnerNetObject[],
  ) {
    super(GameDataPacketType.Spawn);
  }

  static deserialize(reader: MessageReader): SpawnPacket {
    return new SpawnPacket(
      reader.readPackedUInt32(),
      reader.readPackedInt32(),
      reader.readByte(),
      reader.readList<SpawnInnerNetObject>(sub => SpawnInnerNetObject.deserialize(sub)),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.spawnType)
      .writePackedInt32(this.owner)
      .writeByte(this.flags)
      .writeList(this.innerNetObjects, (writer, item) => writer.writeBytes(item.serialize()));
  }
}

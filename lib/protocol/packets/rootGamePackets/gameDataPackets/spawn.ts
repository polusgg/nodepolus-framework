import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SpawnFlag } from "../../../../types/spawnFlag";
import { BaseGameDataPacket } from "../../basePacket";
import { GameDataPacketType } from "../../types";
import { SpawnType } from "../../../../types/spawnType";

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
    return new MessageWriter().writePackedUInt32(this.innerNetObjectID)
      .startMessage(0x01)
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
    const type = reader.readPackedUInt32();
    const owner = reader.readPackedInt32();
    const flags = reader.readByte();

    console.table({
      type: SpawnType[type],
      owner,
    });

    let i = 0;

    const innerNetObjects = reader.readList<SpawnInnerNetObject>(sub => {
      console.log("SUB", i++, sub);

      return SpawnInnerNetObject.deserialize(sub);
    });

    return new SpawnPacket(
      type,
      owner,
      flags,
      innerNetObjects,
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.spawnType)
      .writePackedInt32(this.owner)
      .writeByte(this.flags)
      .writeList(this.innerNetObjects, (writer, item) => {
        
      });
  }
}

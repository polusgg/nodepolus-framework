import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../types/enums";
import { SpawnFlag } from "../../../types/enums";
import { SpawnInnerNetObject } from "./types";

/**
 * Game Data Packet ID: `0x04` (`4`)
 */
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

  clone(): SpawnPacket {
    const objects = new Array(this.innerNetObjects.length);

    for (let i = 0; i < objects.length; i++) {
      objects[i] = this.innerNetObjects[i].clone();
    }

    return new SpawnPacket(this.spawnType, this.owner, this.flags, objects);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.spawnType)
      .writePackedInt32(this.owner)
      .writeByte(this.flags)
      .writeList(this.innerNetObjects, (writer, item) => writer.writeBytes(item.serialize()));
  }
}

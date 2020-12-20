import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../types/enums";
import { SpawnFlag } from "../../../types/enums";
import { SpawnInnerNetObject } from "./types";

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

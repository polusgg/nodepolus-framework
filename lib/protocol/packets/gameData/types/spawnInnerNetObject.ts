import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { GameDataPacketType } from "../../types/enums";
import { BaseGameDataPacket } from "..";

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

  clone(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(this.innerNetObjectID, this.data.clone());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.innerNetObjectID)
      .startMessage(1)
      .writeBytes(this.data)
      .endMessage();
  }
}

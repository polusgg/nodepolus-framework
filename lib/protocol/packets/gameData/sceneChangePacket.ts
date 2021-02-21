import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../../../types/enums";

/**
 * Game Data Packet ID: `0x06` (`6`)
 */
export class SceneChangePacket extends BaseGameDataPacket {
  constructor(
    public clientId: number,
    public scene: string,
  ) {
    super(GameDataPacketType.SceneChange);
  }

  static deserialize(reader: MessageReader): SceneChangePacket {
    return new SceneChangePacket(reader.readPackedUInt32(), reader.readString());
  }

  clone(): SceneChangePacket {
    return new SceneChangePacket(this.clientId, this.scene);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.clientId)
      .writeString(this.scene);
  }
}

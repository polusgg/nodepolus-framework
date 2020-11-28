import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { BaseGameDataPacket } from "../../basePacket";
import { GameDataPacketType } from "../../types";

export class SceneChangePacket extends BaseGameDataPacket {
  constructor(public scene: string) {
    super(GameDataPacketType.SceneChange);
  }

  static deserialize(reader: MessageReader): SceneChangePacket {
    return new SceneChangePacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.scene);
  }
}

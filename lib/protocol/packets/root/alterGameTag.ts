import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AlterGameTag } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class AlterGameTagPacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly tag: AlterGameTag,
    public readonly value: number,
  ) {
    super(RootGamePacketType.AlterGameTag);
  }

  static deserialize(reader: MessageReader): AlterGameTagPacket {
    return new AlterGameTagPacket(LobbyCode.decode(reader.readInt32()), reader.readByte(), reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeByte(this.tag)
      .writeByte(this.value);
  }
}

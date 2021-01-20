import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AlterGameTag } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x0a` (`10`)
 */
export class AlterGameTagPacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly tag: AlterGameTag,
    public readonly value: number,
  ) {
    super(RootPacketType.AlterGameTag);
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

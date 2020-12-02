import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AlterGameTag } from "../../../types/alterGameTag";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class AlterGameTagPacket extends BaseRootGamePacket {
  constructor(
    public readonly roomCode: string,
    public readonly tag: AlterGameTag,
    public readonly value: number,
  ) {
    super(RootGamePacketType.AlterGameTag);
  }

  static deserialize(reader: MessageReader): AlterGameTagPacket {
    return new AlterGameTagPacket(RoomCode.decode(reader.readInt32()), reader.readByte(), reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(RoomCode.encode(this.roomCode))
      .writeByte(this.tag)
      .writeByte(this.value);
  }
}

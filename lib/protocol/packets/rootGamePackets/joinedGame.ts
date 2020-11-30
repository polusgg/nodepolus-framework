import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class JoinedGamePacket extends BaseRootGamePacket {
  constructor(
    readonly roomCode: string,
    readonly joinedClientId: number,
    readonly hostClientId: number,
    readonly otherClientIds: number[],
    readonly disconnectReason: DisconnectReason,
  ) {
    super(RootGamePacketType.JoinedGame);
  }

  static deserialize(reader: MessageReader): JoinedGamePacket {
    return new JoinedGamePacket(
      RoomCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readList(sub => sub.readPackedUInt32()),
      DisconnectReason.deserialize(reader),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeUInt32(this.joinedClientId)
      .writeUInt32(this.hostClientId)
      .writeList(this.otherClientIds, (sub, id) => sub.writePackedUInt32(id));

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

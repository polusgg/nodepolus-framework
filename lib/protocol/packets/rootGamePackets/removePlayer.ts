import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class LateRejectionPacket extends BaseRootGamePacket {
  constructor(
    readonly roomCode: string,
    readonly removedClientId: number,
    readonly disconnectReason: DisconnectReason,
  ) {
    super(RootGamePacketType.RemovePlayer);
  }

  static deserialize(reader: MessageReader): LateRejectionPacket {
    return new LateRejectionPacket(
      RoomCode.decode(reader.readInt32()),
      reader.readPackedUInt32(),
      new DisconnectReason(reader.readByte()),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeInt32(RoomCode.encode(this.roomCode))
      .writePackedUInt32(this.removedClientId);

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

export class RemovePlayerPacket extends BaseRootGamePacket {
  constructor(
    readonly roomCode: string,
    readonly removedClientId: number,
    readonly hostClientId: number,
    readonly disconnectReason?: DisconnectReason,
  ) {
    super(RootGamePacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): RemovePlayerPacket {
    return new RemovePlayerPacket(
      RoomCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : undefined,
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeUInt32(this.removedClientId)
      .writeUInt32(this.hostClientId);

    if (this.disconnectReason) {
      this.disconnectReason.serialize(writer);
    }

    return writer;
  }
}

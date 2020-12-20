import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class LateRejectionPacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly removedClientId: number,
    public readonly disconnectReason: DisconnectReason,
  ) {
    super(RootGamePacketType.RemovePlayer);
  }

  static deserialize(reader: MessageReader): LateRejectionPacket {
    return new LateRejectionPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readPackedUInt32(),
      new DisconnectReason(reader.readByte()),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.removedClientId);

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

export class RemovePlayerPacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly removedClientId: number,
    public readonly hostClientId: number,
    public readonly disconnectReason?: DisconnectReason,
  ) {
    super(RootGamePacketType.RemovePlayer);
  }

  static deserialize(reader: MessageReader): RemovePlayerPacket {
    return new RemovePlayerPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : undefined,
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.removedClientId)
      .writeUInt32(this.hostClientId);

    if (this.disconnectReason) {
      this.disconnectReason.serialize(writer);
    }

    return writer;
  }
}

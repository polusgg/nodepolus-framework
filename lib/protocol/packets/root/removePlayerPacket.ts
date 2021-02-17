import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { DisconnectReason } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x04` (`4`)
 */
export class LateRejectionPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public removedClientId: number,
    public disconnectReason: DisconnectReason,
  ) {
    super(RootPacketType.RemovePlayer);
  }

  static deserialize(reader: MessageReader): LateRejectionPacket {
    return new LateRejectionPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readPackedUInt32(),
      new DisconnectReason(reader.readByte()),
    );
  }

  clone(): LateRejectionPacket {
    return new LateRejectionPacket(this.lobbyCode, this.removedClientId, this.disconnectReason.clone());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.removedClientId);

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

/**
 * Root Packet ID: `0x04` (`4`)
 */
export class RemovePlayerPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public removedClientId: number,
    public hostClientId: number,
    public disconnectReason: DisconnectReason,
  ) {
    super(RootPacketType.RemovePlayer);
  }

  static deserialize(reader: MessageReader): RemovePlayerPacket {
    return new RemovePlayerPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : DisconnectReason.destroy(),
    );
  }

  clone(): RemovePlayerPacket {
    return new RemovePlayerPacket(this.lobbyCode, this.removedClientId, this.hostClientId, this.disconnectReason.clone());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.removedClientId)
      .writeUInt32(this.hostClientId);

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

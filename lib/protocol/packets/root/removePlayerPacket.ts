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
    public readonly lobbyCode: string,
    public readonly removedClientId: number,
    public readonly disconnectReason: DisconnectReason,
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
    public readonly lobbyCode: string,
    public readonly removedClientId: number,
    public readonly hostClientId: number,
    public readonly disconnectReason?: DisconnectReason,
  ) {
    super(RootPacketType.RemovePlayer);
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

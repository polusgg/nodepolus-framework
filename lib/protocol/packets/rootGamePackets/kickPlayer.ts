import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { AlterGameTag } from "../../../types/alterGameTag";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class KickPlayerPacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly kickedClientId: AlterGameTag,
    public readonly banned: boolean,
    public readonly disconnectReason?: DisconnectReason,
  ) {
    super(RootGamePacketType.KickPlayer);
  }

  static deserialize(reader: MessageReader): KickPlayerPacket {
    return new KickPlayerPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readPackedUInt32(),
      reader.readBoolean(),
      reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : undefined,
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.kickedClientId)
      .writeBoolean(this.banned);

    if (this.disconnectReason) {
      this.disconnectReason.serialize(writer);
    }

    return writer;
  }
}

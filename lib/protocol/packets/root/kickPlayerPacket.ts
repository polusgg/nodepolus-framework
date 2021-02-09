import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AlterGameTag } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { DisconnectReason } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x0b` (`11`)
 */
export class KickPlayerPacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly kickedClientId: AlterGameTag,
    public readonly banned: boolean,
    public readonly disconnectReason: DisconnectReason,
  ) {
    super(RootPacketType.KickPlayer);
  }

  static deserialize(reader: MessageReader): KickPlayerPacket {
    const lobbyCode = LobbyCode.decode(reader.readInt32());
    const kickedClientId = reader.readPackedUInt32();
    const banned = reader.readBoolean();

    return new KickPlayerPacket(
      lobbyCode,
      kickedClientId,
      banned,
      reader.hasBytesLeft()
        ? new DisconnectReason(reader.readByte())
        : (banned ? DisconnectReason.banned() : DisconnectReason.kicked()),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.kickedClientId)
      .writeBoolean(this.banned);

    this.disconnectReason.serialize(writer);

    return writer;
  }
}

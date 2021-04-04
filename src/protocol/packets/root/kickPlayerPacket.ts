import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { DisconnectReason } from "../../../types";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x0b` (`11`)
 */
export class KickPlayerPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public kickedClientId: number,
    public banned: boolean,
    public disconnectReason: DisconnectReason,
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

  clone(): KickPlayerPacket {
    return new KickPlayerPacket(this.lobbyCode, this.kickedClientId, this.banned, this.disconnectReason.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.kickedClientId)
      .writeBoolean(this.banned)
      .writeObject(this.disconnectReason, { includeCustomString: false });
  }
}

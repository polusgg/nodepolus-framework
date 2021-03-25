import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOverReason, RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x08` (`8`)
 */
export class EndGamePacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public reason: GameOverReason,
    public showAd: boolean,
  ) {
    super(RootPacketType.EndGame);
  }

  static deserialize(reader: MessageReader): EndGamePacket {
    return new EndGamePacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readByte(),
      reader.readBoolean(),
    );
  }

  clone(): EndGamePacket {
    return new EndGamePacket(this.lobbyCode, this.reason, this.showAd);
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeByte(this.reason)
      .writeBoolean(this.showAd);
  }
}

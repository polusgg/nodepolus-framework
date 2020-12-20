import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOverReason } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

export class EndGamePacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly reason: GameOverReason,
    public readonly showAd: boolean,
  ) {
    super(RootPacketType.EndGame);
  }

  static deserialize(reader: MessageReader): EndGamePacket {
    return new EndGamePacket(LobbyCode.decode(reader.readInt32()), reader.readByte(), reader.readBoolean());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeByte(this.reason)
      .writeBoolean(this.showAd);
  }
}

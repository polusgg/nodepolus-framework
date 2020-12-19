import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOverReason } from "../../../types/gameOverReason";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class EndGamePacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly reason: GameOverReason,
    public readonly showAd: boolean,
  ) {
    super(RootGamePacketType.EndGame);
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

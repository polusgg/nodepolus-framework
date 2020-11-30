import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOverReason } from "../../../types/gameOverReason";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class EndGamePacket extends BaseRootGamePacket {
  constructor(
    readonly roomCode: string,
    readonly reason: GameOverReason,
    readonly showAd: boolean,
  ) {
    super(RootGamePacketType.EndGame);
  }

  static deserialize(reader: MessageReader): EndGamePacket {
    return new EndGamePacket(RoomCode.decode(reader.readInt32()), reader.readByte(), reader.readBoolean());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeByte(this.reason)
      .writeBoolean(this.showAd);
  }
}

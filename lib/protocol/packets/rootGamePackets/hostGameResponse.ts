import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";
import { BasePacket } from "../basePacket";

export class HostGameResponse extends BasePacket {
  constructor(public readonly roomCode: string) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameResponse {
    return new HostGameResponse(RoomCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    writer.writeInt32(RoomCode.encode(this.roomCode));

    return writer;
  }
}

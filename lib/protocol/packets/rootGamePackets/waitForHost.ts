import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class WaitForHostPacket extends BaseRootGamePacket {
  public clientBound: boolean | undefined;

  constructor(
    public readonly roomCode: string,
    public readonly waitingClientId: number,
  ) {
    super(RootGamePacketType.WaitForHost);
  }

  static deserialize(reader: MessageReader): WaitForHostPacket {
    return new WaitForHostPacket(RoomCode.decode(reader.readInt32()), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(RoomCode.encode(this.roomCode))
      .writeUInt32(this.waitingClientId);
  }
}

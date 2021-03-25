import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0e` (`14`)
 */
export class StartMeetingPacket extends BaseRpcPacket {
  constructor(
    public victimPlayerId?: number,
  ) {
    super(RpcPacketType.StartMeeting);
  }

  static deserialize(reader: MessageReader): StartMeetingPacket {
    const victimPlayerId = reader.readByte();

    return new StartMeetingPacket(victimPlayerId == 0xff ? undefined : victimPlayerId);
  }

  clone(): StartMeetingPacket {
    return new StartMeetingPacket(this.victimPlayerId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.victimPlayerId ?? 0xff);
  }
}

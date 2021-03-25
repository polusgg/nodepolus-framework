import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../../../types/enums";

/**
 * Game Data Packet ID: `0x07` (`7`)
 */
export class ReadyPacket extends BaseGameDataPacket {
  constructor(
    public clientId: number,
  ) {
    super(GameDataPacketType.Ready);
  }

  static deserialize(reader: MessageReader): ReadyPacket {
    return new ReadyPacket(reader.readPackedUInt32());
  }

  clone(): ReadyPacket {
    return new ReadyPacket(this.clientId);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.clientId);
  }
}

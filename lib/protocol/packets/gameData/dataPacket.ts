import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { GameDataPacketType } from "../types/enums";

/**
 * Game Data Packet ID: `0x01` (`1`)
 */
export class DataPacket extends BaseGameDataPacket {
  constructor(
    public senderNetId: number,
    public data: MessageReader | MessageWriter,
  ) {
    super(GameDataPacketType.Data);
  }

  static deserialize(reader: MessageReader): DataPacket {
    return new DataPacket(
      reader.readPackedUInt32(),
      reader.readRemainingBytes(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.senderNetId)
      .writeBytes(this.data);
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";



export class AcknowledgementPacket extends BasePacket {
  constructor(public nonce: number, public missingPackets: boolean[]) {
    super(PacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): AcknowledgementPacket {
    return new AcknowledgementPacket(
      reader.readUInt16(true),
      reader.readBitfield()
    );
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    writer.writeUInt16(this.nonce, true);
    writer.writeBitfield(this.missingPackets);

    return writer;
  }
}

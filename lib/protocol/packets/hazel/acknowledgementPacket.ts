import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class AcknowledgementPacket extends BasePacket {
  constructor(public missingPackets: boolean[]) {
    super(PacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): AcknowledgementPacket {
    return new AcknowledgementPacket(reader.readBitfield());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeBitfield(this.missingPackets);
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../types/enums";
import { BaseHazelPacket } from ".";

export class AcknowledgementPacket extends BaseHazelPacket {
  constructor(public missingPackets: boolean[]) {
    super(HazelPacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): AcknowledgementPacket {
    return new AcknowledgementPacket(reader.readBitfield());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeBitfield(this.missingPackets);
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";
import { Bitfield } from "../../../types";
import { BaseHazelPacket } from ".";

export class AcknowledgementPacket extends BaseHazelPacket {
  constructor(
    public missingPackets: Bitfield,
  ) {
    super(HazelPacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): AcknowledgementPacket {
    return new AcknowledgementPacket(Bitfield.fromNumber(reader.readByte(), 8));
  }

  clone(): AcknowledgementPacket {
    return new AcknowledgementPacket(this.missingPackets.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.missingPackets.toNumber());
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";

type RootGamePacketDataType = {

};

export class RootGamePacket {
  constructor(
    public readonly clientBound: boolean,
    public readonly packets: RootGamePacketDataType[]
  ) {

  }

  // TODO: Make sure reader is fromRawBytes
  static deserialize(reader: MessageReader, clientBound: boolean): Packet {
    let msg = reader.readMessage()
    while(msg) {
      switch(msg.tag) {
        case
      }
      msg = reader.readMessage();
    }
    // finished
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();
    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type);
      writer.writeBytes(this.packets[i].serialize())
      writer.endMessage()
    }
    return writer
  }
}

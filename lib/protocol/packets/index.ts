import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { PacketType } from "./types";
import { BasePacket } from "./basePacket";
import { AcknowledgementPacket } from "./packetTypes/acknowledgementPacket";
import { DisconnectPacket } from "./packetTypes/disconnectPacket";
import { HelloPacket } from "./packetTypes/helloPacket";
import { PingPacket } from "./packetTypes/pingPacket";

type PacketDataType = AcknowledgementPacket
                    | DisconnectPacket
                    | HelloPacket
                    | PingPacket;

export class Packet {
  public readonly type: number;

  constructor(
    public readonly clientBound: boolean,
    public readonly data: PacketDataType
  ) {
    if (data instanceof AcknowledgementPacket) {
      this.type = PacketType.Acknowledgement;
    } else if (data instanceof DisconnectPacket) {
      this.type = PacketType.Disconnect;
    } else if (data instanceof HelloPacket) {
      this.type = PacketType.Hello;
    } else if (data instanceof PingPacket) {
      this.type = PacketType.Ping;
    // } else if (data instanceof UnreliablePacket) { // TODO: Uncomment
    //   this.type = PacketType.Unreliable
    } else {
      throw new Error("Unsupported packet type: " + typeof data);
    }
  }

  // TODO: Make sure reader is fromRawBytes
  static deserialize(reader: MessageReader, clientBound: boolean): Packet {
    let type = reader.readByte();
    let nonce: number | undefined;
    let data: PacketDataType;
    
    switch(type) {
      case PacketType.Reliable:
        nonce = reader.readUInt16(true);
      case PacketType.Unreliable:
        // TODO: Implement
        break;
      case PacketType.Hello:
        data = HelloPacket.deserialize(reader);
        break;
      case PacketType.Ping:
        data = PingPacket.deserialize(reader);
        break;
      case PacketType.Disconnect:
        data = DisconnectPacket.deserialize(reader);
        break;
      case PacketType.Acknowledgement:
        data = AcknowledgementPacket.deserialize(reader);
        break;
      default:
        throw new Error("Unhandled packet type: " + type);
    }
    
    return new Packet(clientBound, data);
  }

  serialize(): MessageWriter {
    // TODO: Implement
  }
}

import { AcknowledgementPacket } from "./packetTypes/acknowledgementPacket";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { DisconnectPacket } from "./packetTypes/disconnectPacket";
import { RootGamePacket } from "./packetTypes/genericPacket";
import { HelloPacket } from "./packetTypes/helloPacket";
import { PingPacket } from "./packetTypes/pingPacket";
import { PacketType } from "./types";

type PacketDataType = AcknowledgementPacket | DisconnectPacket | HelloPacket | PingPacket | RootGamePacket;

export class Packet {
  public readonly type: number;
  clientBound: boolean | undefined;

  constructor(public readonly nonce: number | undefined, public readonly data: PacketDataType) {
    if (data instanceof AcknowledgementPacket) {
      this.type = PacketType.Acknowledgement;
    } else if (data instanceof DisconnectPacket) {
      this.type = PacketType.Disconnect;
    } else if (data instanceof HelloPacket) {
      this.type = PacketType.Hello;
    } else if (data instanceof PingPacket) {
      this.type = PacketType.Ping;
    } else if (data instanceof RootGamePacket) {
      this.type = this.nonce ? PacketType.Reliable : PacketType.Unreliable;
    } else {
      throw new Error("Unsupported packet type: " + typeof data);
    }
  }

  static deserialize(reader: MessageReader, clientBound: boolean): Packet {
    let type = reader.readByte();
    let data: PacketDataType;
    let nonce: number | undefined;

    switch (type) {
      case PacketType.Reliable:
        nonce = reader.readUInt16(true);
      case PacketType.Unreliable:
        data = RootGamePacket.deserialize(reader, clientBound);
        break;
      case PacketType.Hello:
        nonce = reader.readUInt16(true);
        data = HelloPacket.deserialize(reader);
        break;
      case PacketType.Ping:
        nonce = reader.readUInt16(true);
        data = PingPacket.deserialize(reader);
        break;
      case PacketType.Disconnect:
        data = DisconnectPacket.deserialize(reader);
        break;
      case PacketType.Acknowledgement:
        nonce = reader.readUInt16(true);
        data = AcknowledgementPacket.deserialize(reader);
        break;
      default:
        throw new Error("Unhandled packet type: " + type);
    }

    return new Packet(nonce, data).bound(clientBound);
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter().writeByte(this.type);

    if (
      this.type == PacketType.Reliable ||
      this.type == PacketType.Hello ||
      this.type == PacketType.Ping ||
      this.type == PacketType.Acknowledgement
    ) {
      if (!this.nonce) {
        throw new Error("Missing nonce in reliable packet");
      }

      writer.writeUInt16(this.nonce, true);
    }

    return writer.writeBytes(this.data.serialize());
  }

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

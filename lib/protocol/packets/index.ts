import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { AcknowledgementPacket } from "./hazel/acknowledgementPacket";
import { DisconnectPacket } from "./hazel/disconnectPacket";
import { RootGamePacket } from "./hazel/genericPacket";
import { HelloPacket } from "./hazel/helloPacket";
import { PingPacket } from "./hazel/pingPacket";
import { Level } from "../../types/enums";
import { PacketType } from "./types";

type PacketDataType = AcknowledgementPacket
| DisconnectPacket
| HelloPacket
| PingPacket
| RootGamePacket;

export class Packet {
  public readonly type: number;

  public clientBound: boolean | undefined;

  constructor(
    public readonly nonce: number | undefined,
    public readonly data: PacketDataType,
  ) {
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
      throw new Error(`Unsupported packet type: ${typeof data}`);
    }
  }

  static isReliable(type: PacketType): boolean {
    return type == PacketType.Reliable
        || type == PacketType.Hello
        || type == PacketType.Ping
        || type == PacketType.Acknowledgement;
  }

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): Packet {
    const type = reader.readByte();
    let data: PacketDataType;
    let nonce: number | undefined;

    if (Packet.isReliable(type)) {
      nonce = reader.readUInt16(true);
    }

    switch (type) {
      case PacketType.Reliable:
      case PacketType.Unreliable:
        data = RootGamePacket.deserialize(reader, clientBound, level);
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
        throw new Error(`Attempted to deserialize an unimplemented packet type: ${type} (${PacketType[type]})`);
    }

    return new Packet(nonce, data).bound(clientBound);
  }

  isReliable(): boolean {
    return Packet.isReliable(this.type);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeByte(this.type);

    if (this.isReliable()) {
      if (this.nonce === undefined) {
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

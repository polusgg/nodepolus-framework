import { AcknowledgementPacket, DisconnectPacket, HelloPacket, PingPacket, RootPacket } from "./hazel";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { HazelPacketType } from "./types/enums";
import { Level } from "../../types/enums";

type PacketDataType = AcknowledgementPacket
| DisconnectPacket
| HelloPacket
| PingPacket
| RootPacket;

export class Packet {
  public type: number;

  private clientBound?: boolean;

  constructor(
    public nonce: number | undefined,
    public data: PacketDataType,
  ) {
    if (data instanceof AcknowledgementPacket) {
      this.type = HazelPacketType.Acknowledgement;
    } else if (data instanceof DisconnectPacket) {
      this.type = HazelPacketType.Disconnect;
    } else if (data instanceof HelloPacket) {
      this.type = HazelPacketType.Hello;
    } else if (data instanceof PingPacket) {
      this.type = HazelPacketType.Ping;
    } else if (data instanceof RootPacket) {
      this.type = this.nonce ? HazelPacketType.Reliable : HazelPacketType.Unreliable;
    } else {
      throw new Error(`Unsupported packet type: ${typeof data}`);
    }
  }

  static isReliable(type: HazelPacketType): boolean {
    return type == HazelPacketType.Reliable
        || type == HazelPacketType.Hello
        || type == HazelPacketType.Ping
        || type == HazelPacketType.Acknowledgement;
  }

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): Packet {
    if (!reader.hasBytesLeft()) {
      throw new Error("Attempted to deserialize a packet with no data");
    }

    const type = reader.readByte();
    let data: PacketDataType;
    let nonce: number | undefined;

    if (Packet.isReliable(type)) {
      nonce = reader.readUInt16(true);
    }

    switch (type) {
      case HazelPacketType.Reliable:
      case HazelPacketType.Unreliable:
        data = RootPacket.deserialize(reader, clientBound, level);
        break;
      case HazelPacketType.Hello:
        data = HelloPacket.deserialize(reader);
        break;
      case HazelPacketType.Ping:
        data = PingPacket.deserialize(reader);
        break;
      case HazelPacketType.Disconnect:
        data = DisconnectPacket.deserialize(reader);
        break;
      case HazelPacketType.Acknowledgement:
        data = AcknowledgementPacket.deserialize(reader);
        break;
      default:
        throw new Error(`Attempted to deserialize an unimplemented packet type: ${type} (${HazelPacketType[type]})`);
    }

    return new Packet(nonce, data).setClientBound(clientBound);
  }

  clone(): Packet {
    const packet = new Packet(this.nonce, this.data);

    packet.clientBound = this.clientBound;

    return packet;
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

  isClientBound(): boolean {
    return this.clientBound ?? false;
  }

  setClientBound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

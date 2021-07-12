import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { ResourceType } from "../../../../types/enums";
import {
  FetchResourceResponseEndedPacket,
  FetchResourceResponseFailedPacket,
  FetchResourceResponseStartedPacket,
} from "./fetchResource";

export class FetchResourcePacket extends BaseRootPacket {
  constructor(
    public readonly resourceId: number,
    public readonly resourceLocation: string,
    public readonly hash: Buffer,
    public readonly resourceType: ResourceType,
  ) {
    super(0x80);
  }

  static deserialize(reader: MessageReader): FetchResourcePacket {
    return new FetchResourcePacket(
      reader.readPackedUInt32(),
      reader.readString(),
      Buffer.from(reader.readBytes(32).getBuffer()),
      reader.readByte(),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.resourceId);
    writer.writeString(this.resourceLocation);
    writer.writeBytes(this.hash);
    writer.writeByte(this.resourceType);
  }

  clone(): FetchResourcePacket {
    return new FetchResourcePacket(
      this.resourceId,
      this.resourceLocation,
      this.hash,
      this.resourceType,
    );
  }
}

export class FetchResourceResponsePacket extends BaseRootPacket {
  constructor(
    public readonly resourceId: number,
    public readonly response: BaseRootPacket,
  ) {
    super(0x80);
  }

  static deserialize(reader: MessageReader): FetchResourceResponsePacket {
    const resourceId = reader.readPackedUInt32();
    const type = reader.readByte();

    switch (type) {
      case 0:
        return new FetchResourceResponsePacket(resourceId, FetchResourceResponseStartedPacket.deserialize(reader));
      case 1:
        return new FetchResourceResponsePacket(resourceId, FetchResourceResponseEndedPacket.deserialize(reader));
      case 2:
        return new FetchResourceResponsePacket(resourceId, FetchResourceResponseFailedPacket.deserialize(reader));
      default:
        throw new Error(`Unknown resource response type: ${type}`);
    }
  }

  serialize(writer: MessageWriter): void {
    writer
      .writePackedUInt32(this.resourceId)
      .writeByte(this.response.getType());

    this.response.serialize(writer);
  }

  clone(): FetchResourceResponsePacket {
    return new FetchResourceResponsePacket(this.resourceId, this.response.clone());
  }
}

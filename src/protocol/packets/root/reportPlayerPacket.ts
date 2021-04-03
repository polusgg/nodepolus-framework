import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ReportOutcome, ReportReason, RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x11` (`17`)
 */
export class ReportPlayerRequestPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public reportedClientId: number,
    public reportReason: ReportReason,
  ) {
    super(RootPacketType.ReportPlayer);
  }

  static deserialize(reader: MessageReader): ReportPlayerRequestPacket {
    return new ReportPlayerRequestPacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readPackedUInt32(),
      reader.readByte(),
    );
  }

  clone(): ReportPlayerRequestPacket {
    return new ReportPlayerRequestPacket(this.lobbyCode, this.reportedClientId, this.reportReason);
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode))
      .writePackedUInt32(this.reportedClientId)
      .writeByte(this.reportReason);
  }
}

/**
 * Root Packet ID: `0x11` (`17`)
 */
export class ReportPlayerResponsePacket extends BaseRootPacket {
  constructor(
    public reportedClientId: number,
    public reportReason: ReportReason,
    public reportOutcome: ReportOutcome,
    public reportedClientName: string,
  ) {
    super(RootPacketType.ReportPlayer);
  }

  static deserialize(reader: MessageReader): ReportPlayerResponsePacket {
    return new ReportPlayerResponsePacket(
      reader.readPackedUInt32(),
      reader.readUInt32(),
      reader.readByte(),
      reader.readString(),
    );
  }

  clone(): ReportPlayerResponsePacket {
    return new ReportPlayerResponsePacket(
      this.reportedClientId,
      this.reportReason,
      this.reportOutcome,
      this.reportedClientName,
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.reportedClientId)
      .writeUInt32(this.reportReason)
      .writeByte(this.reportOutcome)
      .writeString(this.reportedClientName);
  }
}

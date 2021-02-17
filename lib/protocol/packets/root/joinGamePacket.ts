import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReasonType, Level } from "../../../types/enums";
import { Bitfield, DisconnectReason } from "../../../types";
import { LobbyCode } from "../../../util/lobbyCode";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x01` (`1`)
 */
export class JoinGameRequestPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public ownedMaps: Level[],
  ) {
    super(RootPacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameRequestPacket {
    return new JoinGameRequestPacket(
      LobbyCode.decode(reader.readInt32()),
      Bitfield.fromNumber(reader.readByte(), 8).asNumbers<Level>(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeByte(this.ownedMaps.reduce((accum, val) => accum | val));
  }
}

/**
 * Root Packet ID: `0x01` (`1`)
 */
export class JoinGameResponsePacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public joiningClientId: number,
    public hostClientId: number,
  ) {
    super(RootPacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameResponsePacket {
    return new JoinGameResponsePacket(LobbyCode.decode(reader.readInt32()), reader.readUInt32(), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.joiningClientId)
      .writeUInt32(this.hostClientId);
  }
}

/**
 * Root Packet ID: `0x01` (`1`)
 */
export class JoinGameErrorPacket extends BaseRootPacket {
  public disconnectReason: DisconnectReason;

  constructor(
    disconnectReason: DisconnectReason | DisconnectReasonType,
  ) {
    super(RootPacketType.JoinGame);

    if (disconnectReason instanceof DisconnectReason) {
      this.disconnectReason = disconnectReason;
    } else {
      this.disconnectReason = new DisconnectReason(disconnectReason);
    }
  }

  static deserialize(reader: MessageReader): JoinGameErrorPacket {
    return new JoinGameErrorPacket(reader.readInt32());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.disconnectReason.serialize(writer, true);

    return writer;
  }
}

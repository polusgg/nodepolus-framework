import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReasonType, Level } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { Bitfield, DisconnectReason } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

export class JoinGameRequestPacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly ownedMaps: Level[],
  ) {
    super(RootPacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameRequestPacket {
    return new JoinGameRequestPacket(
      LobbyCode.decode(reader.readInt32()),
      // TODO: Probably broken but just an example
      Bitfield.fromNumber(reader.readByte(), 8).asNumbers(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeByte(this.ownedMaps.reduce((accum, val) => accum | val));
  }
}

export class JoinGameResponsePacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly joiningClientId: number,
    public readonly hostClientId: number,
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

export class JoinGameErrorPacket extends BaseRootPacket {
  public readonly disconnectReason: DisconnectReason;

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

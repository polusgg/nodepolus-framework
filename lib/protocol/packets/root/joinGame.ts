import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { DisconnectReasonType, Level } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class JoinGameRequestPacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly ownedMaps: Level[],
  ) {
    super(RootGamePacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameRequestPacket {
    return new JoinGameRequestPacket(
      LobbyCode.decode(reader.readInt32()),
      // TODO: Probably broken but just an example
      reader.readBitfield()
        .reverse()
        .map((bit, index) => (bit ? 1 << index : 0))
        .filter(bit => bit),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeInt32(this.ownedMaps.reduce((accum, val) => accum | val));
  }
}

export class JoinGameResponsePacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly joiningClientId: number,
    public readonly hostClientId: number,
  ) {
    super(RootGamePacketType.JoinGame);
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

export class JoinGameErrorPacket extends BaseRootGamePacket {
  public readonly disconnectReason: DisconnectReason;

  constructor(
    disconnectReason: DisconnectReason | DisconnectReasonType,
  ) {
    super(RootGamePacketType.JoinGame);

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

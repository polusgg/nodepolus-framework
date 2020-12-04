import { DisconnectionType, DisconnectReason } from "../../../types/disconnectReason";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";
import { Level } from "../../../types/level";

export class JoinGameRequestPacket extends BaseRootGamePacket {
  constructor(
    public readonly roomCode: string,
    public readonly ownedMaps: Level[],
  ) {
    super(RootGamePacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameRequestPacket {
    return new JoinGameRequestPacket(
      RoomCode.decode(reader.readInt32()),
      // TODO: Probably broken but just an example
      reader.readBitfield()
        .reverse()
        .map((bit, index) => (bit ? 1 << index : 0))
        .filter(bit => bit),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeInt32(this.ownedMaps.reduce((accum, val) => accum | val));
  }
}

export class JoinGameResponsePacket extends BaseRootGamePacket {
  constructor(
    public readonly roomCode: string,
    public readonly joiningClientId: number,
    public readonly hostClientId: number,
  ) {
    super(RootGamePacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameResponsePacket {
    return new JoinGameResponsePacket(RoomCode.decode(reader.readInt32()), reader.readUInt32(), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeUInt32(this.joiningClientId)
      .writeUInt32(this.hostClientId);
  }
}

export class JoinGameErrorPacket extends BaseRootGamePacket {
  public readonly disconnectReason: DisconnectReason;

  constructor(
    disconnectReason: DisconnectReason | DisconnectionType,
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

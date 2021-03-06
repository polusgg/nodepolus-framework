import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { DisconnectReason } from "../../../types";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x01` (`1`)
 */
export class JoinGameRequestPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
  ) {
    super(RootPacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameRequestPacket {
    return new JoinGameRequestPacket(
      LobbyCode.decode(reader.readInt32()),
    );
  }

  clone(): JoinGameRequestPacket {
    return new JoinGameRequestPacket(this.lobbyCode);
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode));
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

  clone(): JoinGameResponsePacket {
    return new JoinGameResponsePacket(this.lobbyCode, this.joiningClientId, this.hostClientId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.joiningClientId)
      .writeUInt32(this.hostClientId);
  }
}

/**
 * Root Packet ID: `0x01` (`1`)
 */
export class JoinGameErrorPacket extends BaseRootPacket {
  constructor(
    public disconnectReason: DisconnectReason,
  ) {
    super(RootPacketType.JoinGame);
  }

  static deserialize(reader: MessageReader): JoinGameErrorPacket {
    return new JoinGameErrorPacket(new DisconnectReason(reader.readInt32()));
  }

  clone(): JoinGameErrorPacket {
    return new JoinGameErrorPacket(this.disconnectReason.clone());
  }

  serialize(writer: MessageWriter): void {
    this.disconnectReason.serialize(writer, true);
  }
}

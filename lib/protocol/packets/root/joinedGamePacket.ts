import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x07` (`7`)
 */
export class JoinedGamePacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public joinedClientId: number,
    public hostClientId: number,
    public otherClientIds: number[],
  ) {
    super(RootPacketType.JoinedGame);
  }

  static deserialize(reader: MessageReader): JoinedGamePacket {
    return new JoinedGamePacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readList(sub => sub.readPackedUInt32()),
    );
  }

  clone(): JoinedGamePacket {
    return new JoinedGamePacket(this.lobbyCode, this.joinedClientId, this.hostClientId, [...this.otherClientIds]);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.joinedClientId)
      .writeUInt32(this.hostClientId)
      .writeList(this.otherClientIds, (sub, id) => sub.writePackedUInt32(id));
  }
}

import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class JoinedGamePacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
    public readonly joinedClientId: number,
    public readonly hostClientId: number,
    public readonly otherClientIds: number[],
  ) {
    super(RootGamePacketType.JoinedGame);
  }

  static deserialize(reader: MessageReader): JoinedGamePacket {
    return new JoinedGamePacket(
      LobbyCode.decode(reader.readInt32()),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readList(sub => sub.readPackedUInt32()),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.joinedClientId)
      .writeUInt32(this.hostClientId)
      .writeList(this.otherClientIds, (sub, id) => sub.writePackedUInt32(id));
  }
}

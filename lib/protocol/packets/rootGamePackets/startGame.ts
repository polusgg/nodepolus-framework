import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class StartGamePacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
  ) {
    super(RootGamePacketType.StartGame);
  }

  static deserialize(reader: MessageReader): StartGamePacket {
    return new StartGamePacket(LobbyCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

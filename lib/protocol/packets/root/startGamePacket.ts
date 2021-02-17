import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x02` (`2`)
 */
export class StartGamePacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
  ) {
    super(RootPacketType.StartGame);
  }

  static deserialize(reader: MessageReader): StartGamePacket {
    return new StartGamePacket(LobbyCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

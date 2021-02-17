import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x0c` (`12`)
 */
export class WaitForHostPacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
    public waitingClientId: number,
  ) {
    super(RootPacketType.WaitForHost);
  }

  static deserialize(reader: MessageReader): WaitForHostPacket {
    return new WaitForHostPacket(LobbyCode.decode(reader.readInt32()), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeUInt32(this.waitingClientId);
  }
}

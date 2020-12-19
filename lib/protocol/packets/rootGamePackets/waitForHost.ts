import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class WaitForHostPacket extends BaseRootGamePacket {
  public clientBound: boolean | undefined;

  constructor(
    public readonly lobbyCode: string,
    public readonly waitingClientId: number,
  ) {
    super(RootGamePacketType.WaitForHost);
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

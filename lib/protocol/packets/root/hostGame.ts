import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class HostGameRequestPacket extends BaseRootGamePacket {
  constructor(
    public readonly options: GameOptionsData,
  ) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameRequestPacket {
    return new HostGameRequestPacket(GameOptionsData.deserialize(reader));
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.options.serialize(writer);

    return writer;
  }
}

export class HostGameResponsePacket extends BaseRootGamePacket {
  constructor(
    public readonly lobbyCode: string,
  ) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameResponsePacket {
    return new HostGameResponsePacket(LobbyCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

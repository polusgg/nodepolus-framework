import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { GameOptionsData } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

export class HostGameRequestPacket extends BaseRootPacket {
  constructor(
    public readonly options: GameOptionsData,
  ) {
    super(RootPacketType.HostGame);
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

export class HostGameResponsePacket extends BaseRootPacket {
  constructor(
    public readonly lobbyCode: string,
  ) {
    super(RootPacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameResponsePacket {
    return new HostGameResponsePacket(LobbyCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

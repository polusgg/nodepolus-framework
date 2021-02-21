import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { GameOptionsData } from "../../../types";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x00` (`0`)
 */
export class HostGameRequestPacket extends BaseRootPacket {
  constructor(
    public options: GameOptionsData,
  ) {
    super(RootPacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameRequestPacket {
    return new HostGameRequestPacket(GameOptionsData.deserialize(reader));
  }

  clone(): HostGameRequestPacket {
    return new HostGameRequestPacket(this.options.clone());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.options.serialize(writer);

    return writer;
  }
}

/**
 * Root Packet ID: `0x00` (`0`)
 */
export class HostGameResponsePacket extends BaseRootPacket {
  constructor(
    public lobbyCode: string,
  ) {
    super(RootPacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameResponsePacket {
    return new HostGameResponsePacket(LobbyCode.decode(reader.readInt32()));
  }

  clone(): HostGameResponsePacket {
    return new HostGameResponsePacket(this.lobbyCode);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

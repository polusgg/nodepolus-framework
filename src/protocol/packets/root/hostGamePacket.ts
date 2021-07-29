import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { QuickChatMode, RootPacketType } from "../../../types/enums";
import { LobbyCode } from "../../../util/lobbyCode";
import { GameOptionsData } from "../../../types";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x00` (`0`)
 */
export class HostGameRequestPacket extends BaseRootPacket {
  constructor(
    public options: GameOptionsData,
    public quickChatMode: QuickChatMode,
    public isMigrated: boolean,
  ) {
    super(RootPacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameRequestPacket {
    return new HostGameRequestPacket(GameOptionsData.deserialize(reader), reader.readByte(), reader.readBoolean());
  }

  clone(): HostGameRequestPacket {
    return new HostGameRequestPacket(this.options.clone(), this.quickChatMode, this.isMigrated);
  }

  serialize(writer: MessageWriter): void {
    writer.writeObject(this.options).writeByte(this.quickChatMode).writeBoolean(this.isMigrated);
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

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode));
  }
}

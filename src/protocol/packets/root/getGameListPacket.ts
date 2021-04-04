import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { QuickChatMode, RootPacketType } from "../../../types/enums";
import { GameOptionsData, LobbyListing } from "../../../types";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x10` (`16`)
 */
export class GetGameListRequestPacket extends BaseRootPacket {
  constructor(
    public unknown: number,
    public options: GameOptionsData,
    public quickChatMode: QuickChatMode,
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListRequestPacket {
    return new GetGameListRequestPacket(
      reader.readPackedInt32(),
      GameOptionsData.deserialize(reader, true),
      reader.readByte(),
    );
  }

  clone(): GetGameListRequestPacket {
    return new GetGameListRequestPacket(this.unknown, this.options.clone(), this.quickChatMode);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedInt32(this.unknown)
      .writeObject(this.options, { isSearching: true })
      .writeByte(this.quickChatMode);
  }
}

/**
 * Root Packet ID: `0x10` (`16`)
 */
export class GetGameListResponsePacket extends BaseRootPacket {
  constructor(
    public lobbies: LobbyListing[],
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponsePacket {
    const lobbies: LobbyListing[] = [];

    reader.readAllChildMessages(child => {
      if (child.getTag() == 0) {
        child.readAllChildMessages(lobbyMessage => {
          lobbies.push(LobbyListing.deserialize(lobbyMessage));
        });
      }
    });

    return new GetGameListResponsePacket(lobbies);
  }

  clone(): GetGameListResponsePacket {
    const lobbies = new Array(this.lobbies.length);

    for (let i = 0; i < lobbies.length; i++) {
      lobbies[i] = this.lobbies[i].clone();
    }

    return new GetGameListResponsePacket(lobbies);
  }

  serialize(writer: MessageWriter): void {
    writer.startMessage(0);

    for (let i = 0; i < this.lobbies.length; i++) {
      writer.startMessage(0x01)
        .writeObject(this.lobbies[i])
        .endMessage();
    }

    writer.endMessage();
  }
}

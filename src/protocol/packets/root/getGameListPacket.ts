import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData, LobbyListing } from "../../../types";
import { RootPacketType } from "../../../types/enums";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x10` (`16`)
 */
export class GetGameListRequestPacket extends BaseRootPacket {
  constructor(
    public includePrivate: boolean,
    public options: GameOptionsData,
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListRequestPacket {
    return new GetGameListRequestPacket(
      reader.readBoolean(),
      GameOptionsData.deserialize(reader, true),
    );
  }

  clone(): GetGameListRequestPacket {
    return new GetGameListRequestPacket(this.includePrivate, this.options.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.includePrivate);
    this.options.serialize(writer, true);
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

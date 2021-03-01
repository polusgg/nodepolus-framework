import { GameOptionsData, LobbyCount, LobbyListing } from "../../../types";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { BaseRootPacket } from "../root";

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
    public counts?: LobbyCount,
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponsePacket {
    let counts: LobbyCount | undefined;
    const lobbies: LobbyListing[] = [];

    reader.readAllChildMessages(child => {
      if (child.getTag() == 1) {
        counts = LobbyCount.deserialize(child);
      } else if (child.getTag() == 0) {
        child.readAllChildMessages(lobbyMessage => {
          lobbies.push(LobbyListing.deserialize(lobbyMessage));
        });
      }
    });

    return new GetGameListResponsePacket(
      lobbies,
      counts,
    );
  }

  clone(): GetGameListResponsePacket {
    const lobbies = new Array(this.lobbies.length);

    for (let i = 0; i < lobbies.length; i++) {
      lobbies[i] = this.lobbies[i].clone();
    }

    return new GetGameListResponsePacket(lobbies, this.counts?.clone());
  }

  serialize(writer: MessageWriter): void {
    if (this.counts !== undefined) {
      writer.startMessage(1)
        .writeObject(this.counts)
        .endMessage();
    }

    writer.startMessage(0);

    for (let i = 0; i < this.lobbies.length; i++) {
      writer.startMessage(0x01)
        .writeObject(this.lobbies[i])
        .endMessage();
    }

    writer.endMessage();
  }
}

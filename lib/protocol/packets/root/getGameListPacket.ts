import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCount, LobbyListing } from "./types";
import { GameOptionsData } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

export class GetGameListRequestPacket extends BaseRootPacket {
  constructor(
    public readonly includePrivate: boolean,
    public readonly options: GameOptionsData,
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListRequestPacket {
    return new GetGameListRequestPacket(
      reader.readBoolean(),
      GameOptionsData.deserialize(reader, true),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeBoolean(this.includePrivate);

    this.options.serialize(writer, true);

    return writer;
  }
}

export class GetGameListResponsePacket extends BaseRootPacket {
  constructor(
    public readonly lobbies: LobbyListing[],
    public readonly counts?: LobbyCount,
  ) {
    super(RootPacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponsePacket {
    let counts: LobbyCount | undefined;
    const lobbies: LobbyListing[] = [];

    reader.readAllChildMessages(child => {
      if (child.getTag() == 1) {
        counts = new LobbyCount(
          reader.readUInt32(),
          reader.readUInt32(),
          reader.readUInt32(),
          reader.readUInt32(),
        );
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

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    if (this.counts) {
      writer.startMessage(1)
        .writeUInt32(this.counts.skeld)
        .writeUInt32(this.counts.mira)
        .writeUInt32(this.counts.polus)
        .endMessage();
    }

    writer.startMessage(0);

    for (let i = 0; i < this.lobbies.length; i++) {
      writer.startMessage(0x01);
      this.lobbies[i].serialize(writer);
      writer.endMessage();
    }

    return writer.endMessage();
  }
}

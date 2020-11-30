import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";

export class HostGameRequestPacket extends BaseRootGamePacket {
  constructor(readonly options: GameOptionsData) {
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
  constructor(readonly roomCode: string) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameResponsePacket {
    return new HostGameResponsePacket(RoomCode.decode(reader.readInt32()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeInt32(RoomCode.encode(this.roomCode));
  }
}

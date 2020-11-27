import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { RootGamePacketType } from "../types";
import { BasePacket } from "../basePacket";

export class HostGamePacket extends BasePacket {
  constructor(public readonly options: GameOptionsData) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGamePacket {
    return new HostGamePacket(GameOptionsData.deserialize(reader));
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();


    return writer;
  }
}

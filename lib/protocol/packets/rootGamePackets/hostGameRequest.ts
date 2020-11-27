import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { RootGamePacketType } from "../types";
import { BasePacket } from "../basePacket";

export class HostGameRequest extends BasePacket {
  constructor(public readonly options: GameOptionsData) {
    super(RootGamePacketType.HostGame);
  }

  static deserialize(reader: MessageReader): HostGameRequest {
    return new HostGameRequest(GameOptionsData.deserialize(reader));
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();


    return writer;
  }
}

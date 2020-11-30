import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { GameOptionsData } from "../../../../../types/gameOptionsData";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SyncSettingsPacket extends BaseRPCPacket {
  constructor(readonly options: GameOptionsData) {
    super(RPCPacketType.SyncSettings);
  }

  static deserialize(reader: MessageReader): SyncSettingsPacket {
    return new SyncSettingsPacket(GameOptionsData.deserialize(reader));
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.options.serialize(new MessageWriter());

    return writer;
  }
}

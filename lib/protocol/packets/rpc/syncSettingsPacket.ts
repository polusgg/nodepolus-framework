import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class SyncSettingsPacket extends BaseRPCPacket {
  constructor(
    public readonly options: GameOptionsData,
  ) {
    super(RPCPacketType.SyncSettings);
  }

  static deserialize(reader: MessageReader): SyncSettingsPacket {
    return new SyncSettingsPacket(GameOptionsData.deserialize(reader));
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.options.serialize(writer);

    return writer;
  }
}

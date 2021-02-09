import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x02` (`2`)
 */
export class SyncSettingsPacket extends BaseRpcPacket {
  constructor(
    public readonly options: GameOptionsData,
  ) {
    super(RpcPacketType.SyncSettings);
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

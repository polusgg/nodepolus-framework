import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { GameOptionsData } from "../../../types";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x02` (`2`)
 */
export class SyncSettingsPacket extends BaseRpcPacket {
  constructor(
    public options: GameOptionsData,
  ) {
    super(RpcPacketType.SyncSettings);
  }

  static deserialize(reader: MessageReader): SyncSettingsPacket {
    return new SyncSettingsPacket(GameOptionsData.deserialize(reader));
  }

  clone(): SyncSettingsPacket {
    return new SyncSettingsPacket(this.options.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeObject(this.options);
  }
}

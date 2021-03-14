import { GameDataPacketType, RuntimePlatform } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket } from "./baseGameDataPacket";

/**
 * Game Data Packet ID: `0xcd` (`205`)
 */
export class ClientInfoPacket extends BaseGameDataPacket {
  constructor(
    public clientId: number,
    public platform: RuntimePlatform,
  ) {
    super(GameDataPacketType.ClientInfo);
  }

  static deserialize(reader: MessageReader): ClientInfoPacket {
    return new ClientInfoPacket(reader.readPackedUInt32(), reader.readPackedUInt32());
  }

  clone(): ClientInfoPacket {
    return new ClientInfoPacket(this.clientId, this.platform);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.clientId).writePackedUInt32(this.platform);
  }
}

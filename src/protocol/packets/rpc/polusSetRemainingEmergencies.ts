import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class PolusSetRemainingEmergenciesPacket extends BaseRpcPacket {
  constructor(
    public count: number,
  ) {
    super(RpcPacketType.PolusSetRemainingEmergencies);
  }

  static deserialize(reader: MessageReader): PolusSetRemainingEmergenciesPacket {
    return new PolusSetRemainingEmergenciesPacket(reader.readInt32());
  }

  clone(): PolusSetRemainingEmergenciesPacket {
    return new PolusSetRemainingEmergenciesPacket(this.count);
  }

  serialize(writer: MessageWriter): void {
    writer.writeInt32(this.count);
  }
}

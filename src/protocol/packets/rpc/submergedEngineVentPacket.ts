import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class SubmergedEngineVentPacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.SubmergedEngineVent);
  }

  static deserialize(reader: MessageReader): SubmergedEngineVentPacket {
    return new SubmergedEngineVentPacket();
  }

  clone(): SubmergedEngineVentPacket {
    return new SubmergedEngineVentPacket();
  }

  serialize(writer: MessageWriter): void {}
}

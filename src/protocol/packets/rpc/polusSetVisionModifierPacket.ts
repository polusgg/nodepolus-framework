import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class PolusSetVisionModifierPacket extends BaseRpcPacket {
  constructor(
    public modifier: number,
  ) {
    super(RpcPacketType.PolusSetVisionModifier);
  }

  static deserialize(_reader: MessageReader): PolusSetVisionModifierPacket {
    return new PolusSetVisionModifierPacket(_reader.readFloat32());
  }

  clone(): PolusSetVisionModifierPacket {
    return new PolusSetVisionModifierPacket(this.modifier);
  }

  serialize(writer: MessageWriter): void {
    writer.writeFloat32(this.modifier);
  }
}

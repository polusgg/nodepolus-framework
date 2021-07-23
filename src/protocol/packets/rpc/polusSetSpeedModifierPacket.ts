import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class PolusSetSpeedModifierPacket extends BaseRpcPacket {
  constructor(
    public modifier: number,
  ) {
    super(RpcPacketType.PolusSetSpeedModifier);
  }

  static deserialize(_reader: MessageReader): PolusSetSpeedModifierPacket {
    return new PolusSetSpeedModifierPacket(_reader.readFloat32());
  }

  clone(): PolusSetSpeedModifierPacket {
    return new PolusSetSpeedModifierPacket(this.modifier);
  }

  serialize(writer: MessageWriter): void {
    writer.writeFloat32(this.modifier);
  }
}

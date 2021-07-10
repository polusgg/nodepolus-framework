import { Vector2 } from "../../../../../types";
import { RpcPacketType } from "../../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class DisplayKillAnimationPacket extends BaseRpcPacket {
  constructor(
    public killerId: number,
    public victimId: number,
    public snapToPosition: Vector2,
    public killOverlayEnabled: boolean,
  ) {
    super(RpcPacketType.PolusDisplayKillAnimation);
  }

  static deserialize(reader: MessageReader): DisplayKillAnimationPacket {
    return new DisplayKillAnimationPacket(reader.readByte(), reader.readByte(), reader.readVector2(), reader.readBoolean());
  }

  clone(): DisplayKillAnimationPacket {
    return new DisplayKillAnimationPacket(this.killerId, this.victimId, this.snapToPosition, this.killOverlayEnabled);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.killerId).writeByte(this.victimId).writeVector2(this.snapToPosition).writeBoolean(this.killOverlayEnabled);
  }
}

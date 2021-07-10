import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { PlayerAnimationKeyframe } from "../../../animation/player";
import { Bitfield } from "../../../../../types";

export class BeginPlayerAnimation extends BaseRpcPacket {
  constructor(
    public enableBits: Bitfield,
    public keyframes: PlayerAnimationKeyframe[],
    public reset: boolean,
  ) {
    super(0x8c);
  }

  static deserialize(reader: MessageReader): BeginPlayerAnimation {
    const bitfield = Bitfield.fromNumber(reader.readUInt16(), 10);
    const keyframes: PlayerAnimationKeyframe[] = [];

    while (reader.getCursor() < reader.getLength() - 1) {
      keyframes.push(PlayerAnimationKeyframe.deserialize(reader.readMessage()!, bitfield));
    }

    return new BeginPlayerAnimation(bitfield, keyframes, reader.readBoolean());
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt16(this.enableBits.toNumber());

    for (let i = 0; i < this.keyframes.length; i++) {
      writer.startMessage();
      this.keyframes[i].serialize(writer, this.enableBits);
      writer.endMessage();
    }

    writer.writeBoolean(this.reset);
  }

  clone(): BeginPlayerAnimation {
    return new BeginPlayerAnimation(this.enableBits.clone(), this.keyframes.map(c => c.clone()), this.reset);
  }
}

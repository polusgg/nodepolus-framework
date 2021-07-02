import { BaseRpcPacket } from "../baseRpcPacket";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { CameraAnimationKeyframe } from "../../../polus/animation/camera";

export class BeginCameraAnimation extends BaseRpcPacket {
  constructor(
    public keyframes: CameraAnimationKeyframe[],
    public reset: boolean,
  ) {
    super(0x8d);
  }

  static deserialize(reader: MessageReader): BeginCameraAnimation {
    const keyframes: CameraAnimationKeyframe[] = [];

    while (reader.getCursor() < reader.getLength() - 1) {
      keyframes.push(CameraAnimationKeyframe.deserialize(reader.readMessage()!));
    }

    return new BeginCameraAnimation(keyframes, reader.readBoolean());
  }

  serialize(writer: MessageWriter): void {
    for (let i = 0; i < this.keyframes.length; i++) {
      writer.startMessage();
      this.keyframes[i].serialize(writer);
      writer.endMessage();
    }

    writer.writeBoolean(this.reset);
  }

  clone(): BeginCameraAnimation {
    return new BeginCameraAnimation(this.keyframes.map(c => c.clone()), this.reset);
  }
}

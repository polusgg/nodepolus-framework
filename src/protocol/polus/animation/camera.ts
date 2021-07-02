import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Vector2 } from "../../../types";

export class CameraAnimationKeyframe {
  protected offset: number;
  protected duration: number;
  protected position: Vector2;
  protected angle: number;
  protected color: [number, number, number, number] | number[];

  constructor(
    { offset, duration, position, angle, color }: {
      offset: number;
      duration: number;
      position: Vector2;
      angle: number;
      color: [number, number, number, number] | number[];
    },
  ) {
    this.offset = offset;
    this.duration = duration;
    this.position = position;
    this.angle = angle;
    this.color = color;
  }

  static deserialize(reader: MessageReader): CameraAnimationKeyframe {
    return new CameraAnimationKeyframe({
      offset: reader.readPackedUInt32(),
      duration: reader.readPackedUInt32(),
      position: reader.readVector2(),
      angle: reader.readFloat32(),
      color: [reader.readByte(), reader.readByte(), reader.readByte(), reader.readByte()],
    });
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.offset);
    writer.writePackedUInt32(this.duration);
    writer.writeVector2(this.position);
    writer.writeFloat32(this.angle);
    writer.writeBytes(this.color);
  }

  getOffset(): number {
    return this.offset;
  }

  getDuration(): number {
    return this.duration;
  }

  getPosition(): Vector2 {
    return this.position;
  }

  getAngle(): number {
    return this.angle;
  }

  getColor(): [number, number, number, number] {
    return this.color as [number, number, number, number];
  }

  setOffset(offset: number): this {
    this.offset = offset;

    return this;
  }

  setDuration(duration: number): this {
    this.duration = duration;

    return this;
  }

  setPosition(position: Vector2): this {
    this.position = position;

    return this;
  }

  setAngle(angle: number): this {
    this.angle = angle;

    return this;
  }

  setColor(color: [number, number, number, number] | number[]): this {
    this.color = color;

    return this;
  }

  clone(): CameraAnimationKeyframe {
    return new CameraAnimationKeyframe({
      offset: this.getOffset(),
      duration: this.getDuration(),
      position: this.getPosition(),
      angle: this.getAngle(),
      color: this.getColor(),
    });
  }
}

import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { isFloatEqual } from "../util/functions";

export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  static deserialize(reader: MessageReader): Vector2 {
    return new Vector2(
      Vector2.lerp(-40, 40, reader.readUInt16() / 65535.0),
      Vector2.lerp(-40, 40, reader.readUInt16() / 65535.0),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt16(Vector2.unlerp(-40, 40, this.x) * 65535.0);
    writer.writeUInt16(Vector2.unlerp(-40, 40, this.y) * 65535.0);
  }

  equals(other: Vector2, epsilon: number = 0.001): boolean {
    return isFloatEqual(this.x, other.x, epsilon)
        && isFloatEqual(this.y, other.y, epsilon);
  }

  private static lerp(min: number, max: number, value: number): number {
    return min + ((max - min) * Vector2.clamp(0.0, 1.0, value));
  }

  private static unlerp(min: number, max: number, value: number): number {
    return Vector2.clamp(0.0, 1.0, (value - min) / (max - min));
  }

  private static clamp(min: number, max: number, value: number): number {
    return Math.max(Math.min(value, max), min);
  }
}

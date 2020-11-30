import { MessageReader, MessageWriter } from "./hazelMessage";

export class Vector2 {
  constructor(readonly x: number, readonly y: number) {}

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

  private static lerp(min: number, max: number, val: number): number {
    return min + ((max - min) * Vector2.clamp(0, 1, val));
  }

  private static unlerp(min: number, max: number, val: number): number {
    return Vector2.clamp(0, 1, (val - min) / (max - min));
  }

  private static clamp(min: number, max: number, val: number): number {
    return Math.max(Math.min(val, max), min);
  }
}

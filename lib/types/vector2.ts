import { isFloatEqual } from "../util/functions";

export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  static lerp(min: number, max: number, value: number): number {
    return min + ((max - min) * Vector2.clamp(0.0, 1.0, value));
  }

  static unlerp(min: number, max: number, value: number): number {
    return Vector2.clamp(0.0, 1.0, (value - min) / (max - min));
  }

  static clamp(min: number, max: number, value: number): number {
    return Math.max(Math.min(value, max), min);
  }

  equals(other: Vector2, epsilon: number = 0.001): boolean {
    return isFloatEqual(this.x, other.x, epsilon)
        && isFloatEqual(this.y, other.y, epsilon);
  }
}

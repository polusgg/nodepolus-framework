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

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  copyX(value: Vector2): Vector2 {
    return new Vector2(value.x, this.y);
  }

  copyY(value: Vector2): Vector2 {
    return new Vector2(this.x, value.y);
  }

  add(value: Vector2): Vector2;
  add(x: number, y: number): Vector2;
  add(x: number | Vector2, y?: number): Vector2 {
    if (x instanceof Vector2) {
      y = x.y;
      x = x.x;
    } else {
      y = y ?? 0;
    }

    return new Vector2(this.x + x, this.y + y);
  }

  addX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x + value, this.y);
  }

  addY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y + value);
  }

  subtract(value: Vector2): Vector2;
  subtract(x: number, y: number): Vector2;
  subtract(x: number | Vector2, y?: number): Vector2 {
    if (x instanceof Vector2) {
      y = x.y;
      x = x.x;
    } else {
      y = y ?? 0;
    }

    return new Vector2(this.x - x, this.y - y);
  }

  subtractX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x - value, this.y);
  }

  subtractY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y - value);
  }

  multiply(value: Vector2): Vector2;
  multiply(x: number, y: number): Vector2;
  multiply(x: number | Vector2, y?: number): Vector2 {
    if (x instanceof Vector2) {
      y = x.y;
      x = x.x;
    } else {
      y = y ?? 0;
    }

    return new Vector2(this.x * x, this.y * y);
  }

  multiplyX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x * value, this.y);
  }

  multiplyY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y * value);
  }

  divide(value: Vector2): Vector2;
  divide(x: number, y: number): Vector2;
  divide(x: number | Vector2, y?: number): Vector2 {
    if (x instanceof Vector2) {
      y = x.y;
      x = x.x;
    } else {
      y = y ?? 0;
    }

    return new Vector2(this.x / x, this.y / y);
  }

  divideX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x / value, this.y);
  }

  divideY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y / value);
  }
}

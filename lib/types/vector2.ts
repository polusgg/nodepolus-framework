import { isFloatEqual } from "../util/functions";

export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  equals(other: Vector2, epsilon: number = 0.001): boolean {
    return isFloatEqual(this.x, other.x, epsilon)
        && isFloatEqual(this.y, other.y, epsilon);
  }

  is(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
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

  add(value: Vector2): Vector2 {
    return new Vector2(this.x + value.x, this.y + value.y);
  }

  addX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x + value, this.y);
  }

  addY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y + value);
  }

  subtract(value: Vector2): Vector2 {
    return new Vector2(this.x - value.x, this.y - value.y);
  }

  subtractX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x - value, this.y);
  }

  subtractY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y - value);
  }

  multiply(value: Vector2): Vector2 {
    return new Vector2(this.x * value.x, this.y * value.y);
  }

  multiplyX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x * value, this.y);
  }

  multiplyY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y * value);
  }

  divide(value: Vector2): Vector2 {
    return new Vector2(this.x / value.x, this.y / value.y);
  }

  divideX(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.x : value;

    return new Vector2(this.x / value, this.y);
  }

  divideY(value: number | Vector2): Vector2 {
    value = value instanceof Vector2 ? value.y : value;

    return new Vector2(this.x, this.y / value);
  }

  invert(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  invertX(): Vector2 {
    return new Vector2(-this.x, this.y);
  }

  invertY(): Vector2 {
    return new Vector2(this.x, -this.y);
  }

  dot(value: Vector2): number {
    return (this.x * value.x) + (this.y * value.y);
  }

  cross(value: Vector2): number {
    return (this.x * value.y) - (this.y * value.x);
  }

  magnitude(): number {
    return Math.sqrt(this.squaredMagnitude());
  }

  squaredMagnitude(): number {
    return (this.x * this.x) + (this.y * this.y);
  }

  distance(value: Vector2): number {
    return Math.sqrt(this.squaredDistance(value));
  }

  squaredDistance(value: Vector2): number {
    const x = this.distanceX(value);
    const y = this.distanceY(value);

    return (x * x) + (y * y);
  }

  distanceX(value: Vector2): number {
    return this.x - value.x;
  }

  absoluteDistanceX(value: Vector2): number {
    return Math.abs(this.distanceX(value));
  }

  distanceY(value: Vector2): number {
    return this.y - value.y;
  }

  absoluteDistanceY(value: Vector2): number {
    return Math.abs(this.distanceY(value));
  }
}

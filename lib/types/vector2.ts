import { isFloatEqual } from "../util/functions";

/**
 * A class to represent a 2-dimensional vector with various methods to perform
 * vector arithmetic.
 */
export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  /**
   * Gets a new Vector2 where `x = 0` and `y = 0`.
   *
   * @returns A new Vector2 where `x = 0` and `y = 0`
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Checkes whether or not the Vector2 is equal to the given Vector2 by
   * comparing the difference between each of their `x` and `y` values against
   * the given `epsilon` value.
   *
   * @param other The Vector2 to be checked against
   * @param epsilon The margin of error for the comparison (default `0.001`)
   * @returns `true` if the difference of `x` values and `y` values is smaller than the value of `epsilon`
   */
  equals(other: Vector2, epsilon: number = 0.001): boolean {
    return isFloatEqual(this.x, other.x, epsilon) && isFloatEqual(this.y, other.y, epsilon);
  }

  /**
   * Checks whether or not the Vector2 is *exactly* equal to the given Vector2.
   *
   * @param other The Vector2 to be checked against
   * @returns `true` if the Vector2 is *exactly* the same as `other`
   */
  is(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Gets a new Vector2 using the same `x` and `y` values.
   *
   * @returns A new Vector2 where `x = x` and `y = y`
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Gets a new Vector2 using the original `y` value, and the `x` value from the
   * given Vector2.
   *
   * @param other The Vector2 whose `x` value will be used
   * @returns A new Vector2 where `x = other.x` and `y = y`
   */
  copyX(other: Vector2): Vector2 {
    return new Vector2(other.x, this.y);
  }

  /**
   * Gets a new Vector2 using the original `x` value, and the `y` value from the
   * given Vector2.
   *
   * @param other The Vector2 whose `x` value will be used
   * @returns A new Vector2 where `x = x` and `y = other.y`
   */
  copyY(other: Vector2): Vector2 {
    return new Vector2(this.x, other.y);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values added to those from
   * the given Vector2.
   *
   * @param other The Vector2 whose `x` and `y` values will be used as their respective addends
   * @returns A new Vector2 where `x += other.x` and `y += other.y`
   */
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * added to that from the given Vector2.
   *
   * @param other The Vector2 whose `x` value will used as the `x` addend
   * @returns A new Vector2 where `x += other.x` and `y = y`
   */
  addX(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.x : other;

    return new Vector2(this.x + other, this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` value, and original `y` value
   * added to that from the given Vector2.
   *
   * @param other The Vector2 whose `y` value will used as the `y` addend
   * @returns A new Vector2 where `x = x` and `y += other.y`
   */
  addY(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.y : other;

    return new Vector2(this.x, this.y + other);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values subtracted by those
   * from the given Vector2.
   *
   * @param other The Vector2 whose `x` and `y` values will be used as their respective minuends
   * @returns A new Vector2 where `x += other.x` and `y += other.y`
   */
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * subtracted by that from the given Vector2.
   *
   * @param other The Vector2 whose `x` value will be used as the `x` minuend
   * @returns A new Vector2 where `x -= other.x` and `y = y`
   */
  subtractX(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.x : other;

    return new Vector2(this.x - other, this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` value, and original `y` value
   * subtracted by that from the given Vector2.
   *
   * @param other The Vector2 whose `y` value will be used as the `y` minuend
   * @returns A new Vector2 where `x = x` and `y -= other.y`
   */
  subtractY(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.y : other;

    return new Vector2(this.x, this.y - other);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values multiplied by those
   * from the given Vector2.
   *
   * @param other The Vector2 whose `x` and `y` values will be used as their respective multipliers
   * @returns A new Vector2 where `x += other.x` and `y += other.y`
   */
  multiply(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * multiplied by that from the given Vector2.
   *
   * @param other The Vector2 whose `x` value will be used as the `x` multiplier
   * @returns A new Vector2 where `x *= other.x` and `y = y`
   */
  multiplyX(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.x : other;

    return new Vector2(this.x * other, this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` value, and original `y` value
   * multiplied by that from the given Vector2.
   *
   * @param other The Vector2 whose `y` value will be used as the `y` multiplier
   * @returns A new Vector2 where `x = x` and `y *= other.y`
   */
  multiplyY(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.y : other;

    return new Vector2(this.x, this.y * other);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values divided by those
   * from the given Vector2.
   *
   * @param value The Vector2 whose `x` and `y` values will be used as their respective divisors
   * @returns A new Vector2 where `x += other.x` and `y += other.y`
   */
  divide(other: Vector2): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * divided by that from the given Vector2.
   *
   * @param other The Vector2 whose `x` value will used as the `x` divisor
   * @returns A new Vector2 where `x /= other.x` and `y = y`
   */
  divideX(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.x : other;

    return new Vector2(this.x / other, this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` value, and original `y` value
   * divided by that from the given Vector2.
   *
   * @param other The Vector2 whose `y` value will used as the `y` divisor
   * @returns A new Vector2 where `x = x` and `y /= other.y`
   */
  divideY(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other.y : other;

    return new Vector2(this.x, this.y / other);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values after flipping
   * their sign.
   *
   * @returns A new Vector2 where `x = -x` and `y = -y`
   */
  invert(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values after flipping the
   * sign of `x`.
   *
   * @returns A new Vector2 where `x = -x` and `y = y`
   */
  invertX(): Vector2 {
    return new Vector2(-this.x, this.y);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values after flipping the
   * sign of `y`.
   *
   * @returns A new Vector2 where `x = x` and `y = -y`
   */
  invertY(): Vector2 {
    return new Vector2(this.x, -this.y);
  }

  /**
   * Gets the dot product of the original and given Vector2.
   *
   * @param other The second Vector2
   * @returns The dot product of the original Vector2 and `other`
   */
  dot(other: Vector2): number {
    return (this.x * other.x) + (this.y * other.y);
  }

  /**
   * Gets the cross product of the original and given Vector2.
   *
   * @param other The second Vector2
   * @returns The cross product of the original Vector2 and `other`
   */
  cross(other: Vector2): number {
    return (this.x * other.y) - (this.y * other.x);
  }

  /**
   * Gets the length of the Vector2.
   *
   * @returns The length of the Vector2
   */
  magnitude(): number {
    return Math.sqrt(this.squaredMagnitude());
  }

  /**
   * Gets the squared length of the Vector2.
   *
   * @returns The squared length of the Vector2
   */
  squaredMagnitude(): number {
    return (this.x * this.x) + (this.y * this.y);
  }

  /**
   * Gets the distance between the original and given Vector2.
   *
   * @param other The second Vector2
   * @returns The distance between the original Vector2 and `other`
   */
  distance(other: Vector2): number {
    return Math.sqrt(this.squaredDistance(other));
  }

  /**
   * Gets the squared distance between the original and given Vector2.
   *
   * @param other The second Vector2
   * @returns The squared distance between the original Vector2 and `other`
   */
  squaredDistance(other: Vector2): number {
    const x = this.distanceX(other);
    const y = this.distanceY(other);

    return (x * x) + (y * y);
  }

  /**
   * Gets the distance between the original `x` value, and that of the given
   * Vector2.
   *
   * @param other The second Vector2
   * @returns The distance between `x` and `other.x`
   */
  distanceX(value: Vector2): number {
    return this.x - value.x;
  }

  /**
   * Gets the absolute distance between the original `x` value, and that of the
   * given Vector2.
   *
   * @param other The second Vector2
   * @returns The absolute distance between `x` and `other.x`
   */
  absoluteDistanceX(value: Vector2): number {
    return Math.abs(this.distanceX(value));
  }

  /**
   * Gets the distance between the original `y` value, and that of the given
   * Vector2.
   *
   * @param other The second Vector2
   * @returns The distance between `y` and `other.y`
   */
  distanceY(value: Vector2): number {
    return this.y - value.y;
  }

  /**
   * Gets the absolute distance between the original `y` value, and that of the
   * given Vector2.
   *
   * @param other The second Vector2
   * @returns The absolute distance between `y` and `other.y`
   */
  absoluteDistanceY(value: Vector2): number {
    return Math.abs(this.distanceY(value));
  }
}

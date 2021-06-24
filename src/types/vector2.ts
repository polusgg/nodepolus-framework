import { degreesToRadians, isFloatEqual, radiansToDegrees } from "../util/functions";

/**
 * A class used to store and manipulate a 2-dimensional vector.
 */
export class Vector2 {
  /**
   * @param x - The x value
   * @param y - The y value
   */
  constructor(
    protected readonly x: number,
    protected readonly y: number,
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
   * Gets a new Vector2 where `x = 1` and `y = 1`.
   *
   * @returns A new Vector2 where `x = 1` and `y = 1`
   */
  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  /**
   * Gets a new Vector2 where `x = 0` and `y = 1`.
   *
   * @returns A new Vector2 where `x = 0` and `y = 1`
   */
  static up(): Vector2 {
    return new Vector2(0, 1);
  }

  /**
   * Gets a new Vector2 where `x = 0` and `y = -1`.
   *
   * @returns A new Vector2 where `x = 0` and `y = -1`
   */
  static down(): Vector2 {
    return new Vector2(0, -1);
  }

  /**
   * Gets a new Vector2 where `x = -1` and `y = 0`.
   *
   * @returns A new Vector2 where `x = -1` and `y = 0`
   */
  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  /**
   * Gets a new Vector2 where `x = 1` and `y = 0`.
   *
   * @returns A new Vector2 where `x = 1` and `y = 0`
   */
  static right(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * Gets the x value.
   */
  getX(): number {
    return this.x;
  }

  /**
   * Gets the y value.
   */
  getY(): number {
    return this.y;
  }

  /**
   * Gets whether or not the Vector2 is equal to the given Vector2 by
   * comparing the difference between each of their `x` and `y` values against
   * the given `epsilon` value.
   *
   * @param other - The Vector2 to be checked against
   * @param epsilon - The margin of error for the comparison (default `0.001`)
   * @returns `true` if the difference of `x` values and `y` values is smaller than the value of `epsilon`, `false` if not
   */
  equals(other: Vector2, epsilon: number = 0.001): boolean {
    return isFloatEqual(this.x, other.x, epsilon) && isFloatEqual(this.y, other.y, epsilon);
  }

  /**
   * Gets whether or not the Vector2 is *exactly* equal to the given Vector2.
   *
   * @param other - The Vector2 to be checked against
   * @returns `true` if the Vector2 is *exactly* the same as `other`, `false` if not
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
   * @param other - The Vector2 whose `x` value will be used
   * @returns A new Vector2 where `x = other.x` and `y = y`
   */
  copyX(other: Vector2): Vector2 {
    return new Vector2(other.x, this.y);
  }

  /**
   * Gets a new Vector2 using the original `x` value, and the `y` value from the
   * given Vector2.
   *
   * @param other - The Vector2 whose `x` value will be used
   * @returns A new Vector2 where `x = x` and `y = other.y`
   */
  copyY(other: Vector2): Vector2 {
    return new Vector2(this.x, other.y);
  }

  /**
   * Gets a new Vector2 with the original `x` and `y` values added to those from
   * the given Vector2.
   *
   * @param other - The number or Vector2 whose `x` and `y` values will be used as their respective addends
   * @returns A new Vector2 where `x += other.x` and `y += other.y`
   */
  add(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other : new Vector2(other, other);

    return new Vector2(this.x + other.x, this.y + other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * added to that from the given Vector2.
   *
   * @param other - The number or Vector2 whose `x` value will used as the `x` addend
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
   * @param other - The number or Vector2 whose `y` value will used as the `y` addend
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
   * @param other - The number or Vector2 whose `x` and `y` values will be used as their respective minuends
   * @returns A new Vector2 where `x -= other.x` and `y -= other.y`
   */
  subtract(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other : new Vector2(other, other);

    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * subtracted by that from the given Vector2.
   *
   * @param other - The number or Vector2 whose `x` value will be used as the `x` minuend
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
   * @param other - The number or Vector2 whose `y` value will be used as the `y` minuend
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
   * @param other - The number or Vector2 whose `x` and `y` values will be used as their respective multipliers
   * @returns A new Vector2 where `x *= other.x` and `y *= other.y`
   */
  multiply(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other : new Vector2(other, other);

    return new Vector2(this.x * other.x, this.y * other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * multiplied by that from the given Vector2.
   *
   * @param other - The number or Vector2 whose `x` value will be used as the `x` multiplier
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
   * @param other - The number or Vector2 whose `y` value will be used as the `y` multiplier
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
   * @param value - The number or Vector2 whose `x` and `y` values will be used as their respective divisors
   * @returns A new Vector2 where `x /= other.x` and `y /= other.y`
   */
  divide(other: number | Vector2): Vector2 {
    other = other instanceof Vector2 ? other : new Vector2(other, other);

    return new Vector2(this.x / other.x, this.y / other.y);
  }

  /**
   * Gets a new Vector2 with the original `y` value, and original `x` value
   * divided by that from the given Vector2.
   *
   * @param other - The number or Vector2 whose `x` value will used as the `x` divisor
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
   * @param other - The number or Vector2 whose `y` value will used as the `y` divisor
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
   * Gets a new Vector2 after rotating the original `x` and `y` values
   * counter-clockwise by the given angle in radians.
   *
   * @param radians - The angle in radians by which the Vector2 will be rotated
   */
  rotate(radians: number): Vector2 {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return new Vector2(
      (this.x * cos) - (this.y * sin),
      (this.x * sin) + (this.y * cos),
    );
  }

  /**
   * Gets a new Vector2 after rotating the original `x` and `y` values
   * counter-clockwise by the given angle in degrees.
   *
   * @param degrees - The angle in degrees by which the Vector2 will be rotated
   */
  rotateDegrees(degrees: number): Vector2 {
    return this.rotate(degreesToRadians(degrees));
  }

  /**
   * Gets the dot product of the original and given Vector2.
   *
   * @param other - The second Vector2
   */
  dot(other: Vector2): number {
    return (this.x * other.x) + (this.y * other.y);
  }

  /**
   * Gets the cross product of the original and given Vector2.
   *
   * @param other - The second Vector2
   */
  cross(other: Vector2): number {
    return (this.x * other.y) - (this.y * other.x);
  }

  /**
   * Gets the length of the Vector2.
   */
  magnitude(): number {
    return Math.sqrt(this.squaredMagnitude());
  }

  /**
   * Gets the squared length of the Vector2.
   */
  squaredMagnitude(): number {
    return (this.x * this.x) + (this.y * this.y);
  }

  /**
   * Gets the distance between the original and given Vector2.
   *
   * @param other - The second Vector2
   */
  distance(other: Vector2): number {
    return Math.sqrt(this.squaredDistance(other));
  }

  /**
   * Gets the squared distance between the original and given Vector2.
   *
   * @param other - The second Vector2
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
   * @param other - The second Vector2
   */
  distanceX(value: Vector2): number {
    return this.x - value.x;
  }

  /**
   * Gets the absolute distance between the original `x` value, and that of the
   * given Vector2.
   *
   * @param other - The second Vector2
   */
  absoluteDistanceX(value: Vector2): number {
    return Math.abs(this.distanceX(value));
  }

  /**
   * Gets the distance between the original `y` value, and that of the given
   * Vector2.
   *
   * @param other - The second Vector2
   */
  distanceY(value: Vector2): number {
    return this.y - value.y;
  }

  /**
   * Gets the absolute distance between the original `y` value, and that of the
   * given Vector2.
   *
   * @param other - The second Vector2
   */
  absoluteDistanceY(value: Vector2): number {
    return Math.abs(this.distanceY(value));
  }

  /**
   * Gets the angle towards the X axis in radians.
   */
  horizontalAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Gets the angle towards the X axis in degrees.
   */
  horizontalAngleDegrees(): number {
    return radiansToDegrees(this.horizontalAngle());
  }

  /**
   * Gets the angle towards the Y axis in radians.
   */
  verticalAngle(): number {
    return Math.atan2(this.x, this.y);
  }

  /**
   * Gets the angle towards the Y axis in degrees.
   */
  verticalAngleDegrees(): number {
    return radiansToDegrees(this.verticalAngle());
  }

  inside(boundingPoint0: Vector2, boundingPoint1: Vector2): boolean {
    let minX: number, minY: number, maxX: number, maxY: number;

    if (boundingPoint0.getX() < boundingPoint1.getX()) {
      minX = boundingPoint0.getX();
      maxX = boundingPoint1.getX();
    } else {
      minX = boundingPoint1.getX();
      maxX = boundingPoint0.getX();
    }

    if (boundingPoint0.getY() < boundingPoint1.getY()) {
      minY = boundingPoint0.getY();
      maxY = boundingPoint1.getY();
    } else {
      minY = boundingPoint1.getY();
      maxY = boundingPoint0.getY();
    }

    return this.getX() > minX && this.getX() < maxX && this.getY() > minY && this.getY() < maxY;
  }
}

import { bitsInNumber, notUndefined } from "../util/functions";

/**
 * A class used to store, manipulate, and transform a binary bitfield as an
 * array of booleans.
 */
export class Bitfield {
  /**
   * @param bits - The underlying boolean array representing each bit's state
   */
  constructor(
    protected bits: boolean[],
  ) {}

  /**
   * Gets a new Bitfield from the given number and size in bits. The value of
   * `size` will be inferred if omitted, though it may be faster to provide it
   * if it's value is known.
   *
   * @param value - The number to be converted into a Bitfield
   * @param size - The number of bits to be stored in the Bitfield
   * @returns A new bitfield from `value` with all bits set accordingly
   */
  static fromNumber(value: number, size?: number): Bitfield {
    if (size === undefined) {
      size = bitsInNumber(value);
    }

    return new Bitfield(
      [...new Array(size)].map((_, i) => !!((value >> i) & 1)),
    );
  }

  /**
   * Gets the underlying boolean array representing each bit's state.
   */
  getBits(): boolean[] {
    return this.bits;
  }

  /**
   * Gets the number of bits in the bitfield.
   */
  getSize(): number {
    return this.bits.length;
  }

  /**
   * Gets whether or not the Bitfield is equal to the given Bitfield.
   *
   * @param other - The Bitfield to be checked against
   * @returns `true` if the Bitfield is the same as `other`, `false` if not
   */
  equals(other: Bitfield): boolean {
    if (this.bits.length != other.bits.length) {
      return false;
    }

    for (let i = 0; i < this.bits.length; i++) {
      if (this.bits[i] != other.bits[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets a clone of the Bitfield instance.
   */
  clone(): Bitfield {
    return new Bitfield([...this.bits]);
  }

  /**
   * Gets the Bitfield's value as a base-10 number.
   */
  toNumber(): number {
    return (this.bits.map(bit => bit ? 1 : 0) as number[])
      .reduce((result: number, state: number, bit: number) => result | (state ? (1 << bit) : 0));
  }

  /**
   * Gets an array of indices whose corresponding bit is set in the Bitfield.
   * The `modifier` will be added to every index in the resulting array so that
   * the values can be modified to reflect any range of numbers, not just that
   * of the underlying array's index range of `0..n-1`.
   *
   * @example
   * ```
   * const bits = new Bitfield([true, true, true, false, true, false, false, true]);
   *
   * bits.asNumbers() === [0, 1, 2, 4, 7];
   * bits.asNumbers(5) === [5, 6, 7, 9, 12];
   *
   * enum Color {
   *   Red = 0,
   *   Blue = 1,
   *   Green = 2,
   *   Yellow = 3,
   *   Purple = 4,
   *   Orange = 5,
   *   White = 6,
   *   Black = 7,
   * }
   *
   * bits.asNumbers() as Color[] === [Red, Blue, Green, Purple, Black];
   * bits.asNumbers<Color>() === [Red, Blue, Green, Purple, Black];
   * ```
   *
   * @typeParam T - The type of numbers that will be returned
   * @param modifier - The value that will be added to each item in the resulting array (default `0`)
   * @returns An array of all indices whose bit is set in the Bitfield, with `modifier` added to each index
   */
  asNumbers<T extends number>(modifier: number = 0): T[] {
    return this.bits
      .map((state, index) => state ? index + modifier : undefined)
      .filter(notUndefined) as T[];
  }

  /**
   * Gets whether or not the given bit is set.
   *
   * @param bit - The bit to check
   * @returns `true` if the bit at position `bit` is `true`, `false` if not
   */
  has(bit: number): boolean {
    return this.bits[bit];
  }

  /**
   * Gets whether or not any of the given bits are set.
   *
   * @param bits - The bits to check
   * @returns `true` if at least one bit from `bits` is set, `false` if not
   */
  any(bits: number[]): boolean {
    return bits.some(bit => this.bits[bit]);
  }

  /**
   * Gets whether or not all of the given bits are set.
   *
   * @param bits - The bits to check
   * @returns `true` if every bit from `bits` is set, `false` if not
   */
  all(bits: number[]): boolean {
    return bits.every(bit => this.bits[bit]);
  }

  /**
   * Sets the given bit.
   *
   * @param bit - The bit whose state will be set to `true`
   */
  set(bit: number): this {
    this.bits[bit] = true;

    return this;
  }

  /**
   * Unsets the given bit.
   *
   * @param bit - The bit whose state will be set to `false`
   */
  unset(bit: number): this {
    this.bits[bit] = false;

    return this;
  }

  /**
   * Toggles the given bit.
   *
   * @param bit - The bit whose state will be inverted
   */
  toggle(bit: number): this {
    this.bits[bit] = !this.bits[bit];

    return this;
  }

  /**
   * Sets the given bit to the given state.
   *
   * @param bit - The bit whose state will be updated
   * @param state - The new state of the bit
   */
  update(bit: number, state: boolean): this {
    this.bits[bit] = state;

    return this;
  }
}

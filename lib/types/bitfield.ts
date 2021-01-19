import { bitsInNumber, notUndefined } from "../util/functions";

/**
 * A class used to represent a binary bitfield as an array of booleans for easy
 * manipulation and conversion.
 */
export class Bitfield {
  constructor(
    public bits: boolean[],
  ) {}

  /**
   * Gets a new Bitfield from the given number and size in bits. The value of
   * `size` will be calculated if omitted, though it may be faster to provide it
   * if it is known.
   *
   * @param value The number to be converted into a Bitfield
   * @param size The number of bits to be stored in the Bitfield
   * @returns A new bitfield from `value` with all bits set accordingly
   */
  static fromNumber(value: number, size?: number): Bitfield {
    if (!size) {
      size = bitsInNumber(value);
    }

    return new Bitfield(
      [...new Array(size)].map((_, i) => !!((value >> i) & 1)),
    );
  }

  /**
   * Gets the Bitfield's binary number value represented as a base-10 number.
   *
   * @returns The integer value of the Bitfield
   */
  toNumber(): number {
    return (this.bits.map(bit => bit ? 1 : 0) as number[])
      .reduce((result: number, state: number, bit: number) => result | (state ? (1 << bit) : 0));
  }

  /**
   * Gets an array of incrementing indices, starting from `startingIndex`, if
   * the bit at a given position in the Bitfield is set. This is most useful
   * when converting a Bitfield to an array of enum values.
   *
   * @example
   * ```
   * const bits = new Bitfield([false, true, true, false, true, false, false, true]);
   *
   * bits.asNumbers() === [1, 2, 4, 7];
   * bits.asNumbers(5) === [6, 7, 9, 12];
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
   * bits.asNumbers() as Color[] === [Blue, Green, Purple, Black];
   * ```
   *
   * @param startingIndex The index to start at for position `0` of the Bitfield
   * @returns An array of indices in place of set bits, and all unset bits removed
   */
  asNumbers(startingIndex: number = 0): number[] {
    return this.bits
      .map((state, index) => state ? index + startingIndex : undefined)
      .filter(notUndefined);
  }

  /**
   * Checks whether or not the given bit is set.
   *
   * @param bit The bit to check
   * @returns `true` if the bit at position `bit` is `true`, `false` if not
   */
  has(bit: number): boolean {
    return this.bits[bit];
  }

  /**
   * Checks whether or not any of the given bits are set.
   *
   * @param bits The bits to check
   * @returns `true` if one or more of bits from `bits` is set, `false` if not
   */
  any(bits: number[]): boolean {
    return bits.some(bit => this.bits[bit]);
  }

  /**
   * Checks whether or not all of the given bits are set.
   *
   * @param bits The bits to check
   * @returns `true` if every bit from `bits` is set, `false` if not
   */
  all(bits: number[]): boolean {
    return bits.every(bit => this.bits[bit]);
  }

  /**
   * Sets the given bit.
   *
   * @param bit The bit to turn on
   */
  set(bit: number): this {
    this.bits[bit] = true;

    return this;
  }

  /**
   * Unsets the given bit.
   *
   * @param bit The bit to turn off
   */
  unset(bit: number): this {
    this.bits[bit] = false;

    return this;
  }

  /**
   * Toggles the given bit.
   *
   * @param bit The bit to invert
   */
  toggle(bit: number): this {
    this.bits[bit] = !this.bits[bit];

    return this;
  }

  /**
   * Sets the given bit to the given state.
   *
   * @param bit The bit to update
   * @param state The active state of the bit
   */
  update(bit: number, state: boolean): this {
    this.bits[bit] = state;

    return this;
  }
}
